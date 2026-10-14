import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
  UserCredential,
  updateProfile
} from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Official provisioned Firebase client configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyCygGa1ZixCARQ4a2MBB_S1uCTDTi30cvk",
  authDomain: firebaseAppletConfig.authDomain || "gen-lang-client-0112590605.firebaseapp.com",
  projectId: firebaseAppletConfig.projectId || "gen-lang-client-0112590605",
  storageBucket: firebaseAppletConfig.storageBucket || "gen-lang-client-0112590605.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "1014474273646",
  appId: firebaseAppletConfig.appId || "1:1014474273646:web:a1f9a5cc1b319c8631c77f"
};

// Initialize Firebase app singleton
let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (err) {
    console.warn("Firebase app init fallback:", err);
    app = initializeApp(firebaseConfig, 'sf-applet');
  }
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Connectivity validation helper as mandated by firebase guidelines
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'users', 'ping-connection-check'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is currently offline or unreachable.");
      return false;
    }
    // Document not existing or permission denied still verifies reachability to Firebase server
    return true;
  }
}

// Kick off async connection check in background safely
validateFirestoreConnection().catch(() => {});

// Configure Google Provider with required Google Workspace / Gmail scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.labels');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Guard against concurrent popup requests that cause "INTERNAL ASSERTION FAILED: Pending promise was never set"
let isSignInOperationInProgress = false;

export interface SignInResult {
  user: User | null;
  accessToken?: string;
  error?: string;
  cancelled?: boolean;
}

export const DEMO_USER_PROFILE = {
  uid: 'demo-sheikh-farid-user',
  displayName: 'শেখ ফরিদ (ভিজিটর মোড)',
  email: 'farid.workspace@demo.bd',
  photoURL: '/src/assets/images/architect_portrait_1791835932249.jpg',
  emailVerified: true
};

export function signInAsDemoUser(): SignInResult {
  const customPic = getPersistedProfilePicture('demo-sheikh-farid-user') || getPersistedProfilePicture();
  const profile = {
    ...DEMO_USER_PROFILE,
    photoURL: customPic || DEMO_USER_PROFILE.photoURL
  };
  return {
    user: profile as unknown as User,
    accessToken: 'demo_sheikh_farid_gmail_api_token_preview'
  };
}

/**
 * Robust Google Sign-In with popup.
 * Handles auth/popup-closed-by-user and unauthorized domains gracefully.
 */
export async function signInWithGoogleSafe(): Promise<SignInResult> {
  if (isSignInOperationInProgress) {
    return {
      user: auth.currentUser,
      error: 'লগইন প্রক্রিয়া ইতিমধ্যে চলছে, অনুগ্রহ করে অপেক্ষা করুন।'
    };
  }

  isSignInOperationInProgress = true;

  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    return {
      user: result.user,
      accessToken: token
    };
  } catch (err: any) {
    const errorCode = err?.code || '';
    const errorMessage = err?.message || String(err || '');

    // Catch popup-closed-by-user gracefully without throwing
    if (errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('popup-closed-by-user')) {
      return {
        user: null,
        cancelled: true,
        error: 'লগইন উইন্ডো বন্ধ করা হয়েছে।'
      };
    }

    if (errorCode === 'auth/cancelled-popup-request' || errorMessage.includes('cancelled-popup-request')) {
      return {
        user: null,
        cancelled: true,
        error: 'পূর্বের লগইন প্রক্রিয়া বাতিল করা হয়েছে।'
      };
    }

    if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
      return {
        user: null,
        error: 'ব্রাউজারে পপআপ ব্লক করা হয়েছে। অনুগ্রহ করে পপআপ অনুমোদন করুন অথবা ডেমো মোড ব্যবহার করুন।'
      };
    }

    if (errorCode === 'auth/unauthorized-domain' || errorMessage.includes('unauthorized-domain')) {
      return {
        user: null,
        error: 'এই ডোমেনটি ফায়ারবেস অথোরাইজড ডোমেন তালিকায় এখনো যুক্ত নেই। আপনি ডেমো মোডে সরাসরি প্রবেশ করতে পারেন।'
      };
    }

    if (errorCode === 'auth/operation-not-allowed' || errorMessage.includes('operation-not-allowed')) {
      return {
        user: null,
        error: 'ফায়ারবেস কনসোলে গুগল সাইন-ইন মেথড এখনো সক্রিয় করা হয়নি। আপনি ডেমো মোডে সরাসরি ফিচারগুলো পরীক্ষা করতে পারেন।'
      };
    }

    if (errorCode === 'auth/api-key-not-valid' || errorMessage.includes('api-key-not-valid')) {
      return {
        user: null,
        error: 'ফায়ারবেস এপিআই কী সক্রিয়করণ প্রক্রিয়াধীন। অনুগ্রহ করে ডেমো মোড ব্যবহার করুন।'
      };
    }

    // Suppress internal assertion failure strings
    if (errorMessage.includes('Pending promise was never set')) {
      return {
        user: auth.currentUser || null,
        cancelled: true,
        error: 'লগইন উইন্ডো বন্ধ করা হয়েছে।'
      };
    }

    return {
      user: null,
      error: errorMessage || 'গুগল লগইন সম্পন্ন করা যায়নি। ডেমো মোড ব্যবহার করতে পারেন।'
    };
  } finally {
    // Reset lock after a small debounce to allow browser popup messaging to settle
    setTimeout(() => {
      isSignInOperationInProgress = false;
    }, 600);
  }
}

/**
 * Safely sign out the current user
 */
export async function signOutSafe(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out error:", err);
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export interface UploadProfilePictureResult {
  success: boolean;
  downloadURL: string;
  source: 'firebase-storage' | 'local-storage-fallback';
  error?: string;
}

/**
 * Retrieve persisted user profile picture from localStorage for seamless session persistence.
 */
export function getPersistedProfilePicture(userId?: string): string | null {
  try {
    if (userId) {
      const specific = localStorage.getItem(`sf_avatar_${userId}`);
      if (specific) return specific;
    }
    return localStorage.getItem('sf_custom_profile_picture') || null;
  } catch {
    return null;
  }
}

/**
 * Upload a profile picture to Firebase Storage and update Firebase Auth & Firestore.
 * Automatically falls back to high-resolution local persistence if network or cloud rules block storage.
 */
export async function uploadProfilePicture(
  userId: string,
  imageBlobOrFile: Blob | File,
  filename?: string
): Promise<UploadProfilePictureResult> {
  const safeUserId = userId || auth.currentUser?.uid || 'studio-user';
  const cleanFilename = `${Date.now()}_${filename ? filename.replace(/[^a-zA-Z0-9._-]/g, '') : 'avatar.jpg'}`;
  const storagePath = `profile_pictures/${safeUserId}/${cleanFilename}`;

  // Helper to read Base64 for fallback
  const getBase64Data = (): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlobOrFile);
    });

  try {
    // 1. Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    const contentType = imageBlobOrFile.type || 'image/jpeg';
    const metadata = {
      contentType,
      customMetadata: {
        userId: safeUserId,
        uploadedAt: new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(storageRef, imageBlobOrFile, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Update Firebase Auth currentUser profile if logged in
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
      } catch (authErr) {
        console.warn("Auth photoURL update note:", authErr);
      }
    }

    // 3. Update Firestore user document
    try {
      await setDoc(
        doc(db, 'users', safeUserId),
        {
          photoURL: downloadURL,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.warn("Firestore profile sync note:", fsErr);
    }

    // 4. Save to localStorage for instant multi-tab & cross-session availability
    try {
      localStorage.setItem(`sf_avatar_${safeUserId}`, downloadURL);
      localStorage.setItem('sf_custom_profile_picture', downloadURL);
    } catch (e) {
      console.warn("localStorage quota warning:", e);
    }

    // Also update DEMO_USER_PROFILE in memory if user is demo
    if (safeUserId === DEMO_USER_PROFILE.uid || safeUserId.startsWith('demo')) {
      DEMO_USER_PROFILE.photoURL = downloadURL;
    }

    return {
      success: true,
      downloadURL,
      source: 'firebase-storage'
    };
  } catch (storageError: any) {
    console.warn("Firebase Storage direct upload note (falling back to local persistence):", storageError?.message || storageError);

    // Fallback: Read image as data URL and persist locally
    const base64Data = await getBase64Data();

    try {
      localStorage.setItem(`sf_avatar_${safeUserId}`, base64Data);
      localStorage.setItem('sf_custom_profile_picture', base64Data);
    } catch (e) {
      console.warn("localStorage cache error:", e);
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: base64Data });
      } catch (e) {}
    }

    if (safeUserId === DEMO_USER_PROFILE.uid || safeUserId.startsWith('demo')) {
      DEMO_USER_PROFILE.photoURL = base64Data;
    }

    return {
      success: true,
      downloadURL: base64Data,
      source: 'local-storage-fallback',
      error: storageError?.message
    };
  }
}
