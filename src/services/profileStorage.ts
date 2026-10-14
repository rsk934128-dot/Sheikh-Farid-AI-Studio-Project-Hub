import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from './firebase';

export const LOCAL_STORAGE_AVATAR_KEY = 'sf_custom_profile_picture_url';
export const LOCAL_STORAGE_AVATAR_TIME_KEY = 'sf_custom_profile_picture_timestamp';

export interface UploadProfileResult {
  success: boolean;
  url: string;
  storageType: 'firebase-storage' | 'local-fallback';
  message: string;
  error?: string;
}

/**
 * Resizes and center-crops an image file, blob, or dataURL to a high-quality square WebP/JPEG blob
 */
export async function processAndOptimizeImage(
  source: Blob | File | string,
  targetDimension: number = 400,
  quality: number = 0.88
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetDimension;
        canvas.height = targetDimension;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context not supported'));
          return;
        }

        // Center crop calculation (square)
        const minDim = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - minDim) / 2;
        const sy = (img.naturalHeight - minDim) / 2;

        // Smooth image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetDimension, targetDimension);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              // Fallback: create blob from dataUrl
              const byteString = atob(dataUrl.split(',')[1]);
              const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve({ blob: new Blob([ab], { type: mimeString }), dataUrl });
            }
          },
          'image/jpeg',
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => reject(new Error('Failed to load image for processing: ' + String(e)));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Uploads user profile photo to Firebase Storage and updates Auth / Firestore / Local persistence
 */
export async function uploadProfilePicture(
  imageSource: Blob | File | string,
  user?: { uid?: string; displayName?: string; email?: string } | null,
  onProgress?: (percent: number) => void
): Promise<UploadProfileResult> {
  try {
    if (onProgress) onProgress(15);

    // 1. Optimize and crop to square avatar
    const { blob, dataUrl } = await processAndOptimizeImage(imageSource, 420, 0.9);
    if (onProgress) onProgress(45);

    const uid = user?.uid || auth.currentUser?.uid || 'session_user';
    const timestamp = Date.now();
    const filePath = `profile_pictures/${uid}/${timestamp}.jpg`;

    let finalDownloadUrl = '';
    let storageType: 'firebase-storage' | 'local-fallback' = 'firebase-storage';

    // 2. Attempt upload to Firebase Storage
    try {
      const storageRef = ref(storage, filePath);
      
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          uploadedBy: uid,
          uploadedAt: new Date().toISOString()
        }
      };

      const uploadResult = await uploadBytes(storageRef, blob, metadata);
      if (onProgress) onProgress(80);

      finalDownloadUrl = await getDownloadURL(uploadResult.ref);
    } catch (storageErr: any) {
      console.warn('Firebase Storage upload encountered issue, applying persistent session fallback:', storageErr);
      // Fallback: If Firebase Storage has permission or CORS restrictions in the preview container,
      // use the optimized base64 data URL so the user's uploaded picture ALWAYS succeeds and persists!
      finalDownloadUrl = dataUrl;
      storageType = 'local-fallback';
    }

    if (onProgress) onProgress(90);

    // 3. Update Firebase Auth user profile if currentUser exists
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          photoURL: finalDownloadUrl
        });
      } catch (authErr) {
        console.warn('Could not update Firebase Auth photoURL:', authErr);
      }

      // 4. Update Firestore user document
      try {
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          {
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName || user?.displayName || 'Studio User',
            email: auth.currentUser.email || user?.email || '',
            photoURL: finalDownloadUrl,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Could not sync profile to Firestore:', dbErr);
      }
    }

    // 5. Always persist to localStorage for instant hydration across session reloads
    try {
      localStorage.setItem(LOCAL_STORAGE_AVATAR_KEY, finalDownloadUrl);
      localStorage.setItem(LOCAL_STORAGE_AVATAR_TIME_KEY, String(timestamp));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    // 6. Broadcast event so Navbar and all studio components reflect the new avatar immediately
    window.dispatchEvent(
      new CustomEvent('sf-profile-picture-changed', {
        detail: { photoURL: finalDownloadUrl, source: storageType }
      })
    );

    if (onProgress) onProgress(100);

    return {
      success: true,
      url: finalDownloadUrl,
      storageType,
      message:
        storageType === 'firebase-storage'
          ? 'প্রোফাইল ছবি সফলভাবে ফায়ারবেস ক্লাউড স্টোরেজে (Firebase Storage) আপলোড ও সংরক্ষিত হয়েছে!'
          : 'ছবি সফলভাবে প্রসেস করা হয়েছে এবং সেশনের জন্য সংরক্ষিত রয়েছে!'
    };
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      url: '',
      storageType: 'local-fallback',
      message: 'প্রোফাইল ছবি আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      error: error?.message || String(error)
    };
  }
}

/**
 * Retrieves the persisted custom profile picture from localStorage
 */
export function getPersistedProfilePicture(): string | null {
  try {
    return localStorage.getItem(LOCAL_STORAGE_AVATAR_KEY);
  } catch {
    return null;
  }
}

/**
 * Resets or removes the custom profile picture
 */
export async function resetProfilePicture(defaultPhotoUrl?: string): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_AVATAR_KEY);
    localStorage.removeItem(LOCAL_STORAGE_AVATAR_TIME_KEY);

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: defaultPhotoUrl || ''
      }).catch(() => {});

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          photoURL: defaultPhotoUrl || '',
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      ).catch(() => {});
    }

    window.dispatchEvent(
      new CustomEvent('sf-profile-picture-changed', {
        detail: { photoURL: defaultPhotoUrl || null, source: 'reset' }
      })
    );
  } catch (err) {
    console.warn('Error resetting profile picture:', err);
  }
}

/**
 * Camera stream management utilities for live capture
 */
export class CameraManager {
  private stream: MediaStream | null = null;

  async startCamera(
    videoElement: HTMLVideoElement,
    facingMode: 'user' | 'environment' = 'user'
  ): Promise<MediaStream> {
    this.stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('আপনার ব্রাউজারে বা ডিভাইসে ক্যামেরা সাপোর্ট সক্রিয় নেই।');
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 720 },
        height: { ideal: 720 }
      },
      audio: false
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      await videoElement.play();
      return this.stream;
    } catch (err: any) {
      // Fallback if specific resolution or facing mode failed
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoElement.srcObject = this.stream;
      await videoElement.play();
      return this.stream;
    }
  }

  captureFrame(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    const width = videoElement.videoWidth || 640;
    const height = videoElement.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas render context not available');
    }

    // Flip horizontally if front facing camera for mirror effect
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.92);
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
