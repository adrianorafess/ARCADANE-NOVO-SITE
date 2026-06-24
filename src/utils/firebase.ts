import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0011038274",
  appId: "1:250558112733:web:0704c305d03f8b76be0c34",
  apiKey: "AIzaSyDsffZHWuOjE5gEBaO61thpLfP9oqB1zK8",
  authDomain: "gen-lang-client-0011038274.firebaseapp.com",
  storageBucket: "gen-lang-client-0011038274.firebasestorage.app",
  messagingSenderId: "250558112733",
};

const app = initializeApp(firebaseConfig);
const databaseId = "ai-studio-9de8ae5a-fe12-4fa2-96fa-6aa3f4ec9411";

export const db = getFirestore(app, databaseId);

// Core real-time listener and synchronizer for CMS
const COLLECTION_NAME = 'cms';

export interface FirebaseCmsData {
  services?: any[];
  packages?: any[];
  promo_packages?: any[];
  blog_posts?: any[];
  testimonials?: any[];
  seo_settings?: any;
  home_settings?: any;
  luxury_trips?: any[];
  founders_photo?: string;
  trajectory_photo?: string;
  custom_logo?: string;
}

/**
 * Saves a specific CMS key's data to Firebase Firestore.
 */
export async function saveToFirebase(key: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, key);
    await setDoc(docRef, {
      data,
      updatedAt: new Date().toISOString()
    });
    console.log(`[Firebase] Successfully saved key "${key}" to cloud database.`);
  } catch (error) {
    console.error(`[Firebase] Failed to save key "${key}" to Firestore:`, error);
  }
}

/**
 * Loads a single key's data from Firebase Firestore (one-time fetch).
 */
export async function loadFromFirebase(key: string): Promise<any | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().data;
    }
  } catch (error) {
    console.error(`[Firebase] Failed to load key "${key}" from Firestore:`, error);
  }
  return null;
}

/**
 * Sets up a listener for real-time updates from Firebase.
 * Whenever any document in the 'cms' collection changes, we update localStorage
 * and broadcast the change to the entire application.
 */
export function setupFirebaseRealtimeListener(onUpdate: (key: string, data: any) => void): () => void {
  const keys = [
    'services',
    'packages',
    'promo_packages',
    'blog_posts',
    'testimonials',
    'seo_settings',
    'home_settings',
    'luxury_trips',
    'founders_photo',
    'trajectory_photo',
    'custom_logo'
  ];

  const unsubscribes: (() => void)[] = [];

  keys.forEach(key => {
    try {
      const docRef = doc(db, COLLECTION_NAME, key);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          if (remoteData && remoteData.data !== undefined) {
            onUpdate(key, remoteData.data);
          }
        }
      }, (err) => {
        console.warn(`[Firebase] Realtime stream failed for key "${key}":`, err);
      });
      unsubscribes.push(unsub);
    } catch (e) {
      console.error(`[Firebase] Error starting snapshot for key "${key}":`, e);
    }
  });

  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
}
