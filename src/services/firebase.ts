import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
  UserCredential
} from 'firebase/auth';

// Firebase client configuration with fallbacks for AI Studio dev environment
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForStudioPreviewSafeEnv000",
  authDomain: "sheikh-farid-studio.firebaseapp.com",
  projectId: "sheikh-farid-studio",
  storageBucket: "sheikh-farid-studio.appspot.com",
  messagingSenderId: "298086073355",
  appId: "1:298086073355:web:553dca1a070b4537b4c3b4"
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
  return {
    user: DEMO_USER_PROFILE as unknown as User,
    accessToken: 'demo_sheikh_farid_gmail_api_token_preview'
  };
}

/**
 * Robust Google Sign-In with popup.
 * Handles auth/popup-closed-by-user and prevents concurrent auth operations.
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
      error: errorMessage || 'গুগল লগইন সম্পন্ন করা যায়নি।'
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
