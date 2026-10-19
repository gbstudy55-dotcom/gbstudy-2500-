import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Platform, SiteSettings } from '../types';
import { defaultPlatforms, defaultSettings } from '../data/defaultPlatforms';

// Initialize Firebase App & Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.warn('Firestore Operation Error: ', JSON.stringify(errInfo));
}

// Test Connection on Startup
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'general'));
    console.log('Connected to Cloud Firestore database successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline fallback active.');
    }
  }
}

// Subscribe to platforms in real-time
export function subscribeToPlatforms(
  onUpdate: (platforms: Platform[]) => void
): () => void {
  const colRef = collection(db, 'platforms');

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Platform[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Platform);
        });
        // Sort by order ascending
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        onUpdate(list);
      } else {
        // If collection is empty, seed defaults
        seedInitialFirestoreData();
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'platforms');
    }
  );

  return unsubscribe;
}

// Subscribe to settings in real-time
export function subscribeToSettings(
  onUpdate: (settings: SiteSettings) => void
): () => void {
  const settingsDoc = doc(db, 'settings', 'general');

  const unsubscribe = onSnapshot(
    settingsDoc,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        onUpdate({
          ...defaultSettings,
          ...data,
          telegramPopup: {
            ...defaultSettings.telegramPopup,
            ...(data.telegramPopup || {}),
          },
          accessKeySettings: {
            ...defaultSettings.accessKeySettings,
            ...(data.accessKeySettings || {}),
          },
        });
      } else {
        // Seed settings
        setDoc(settingsDoc, defaultSettings).catch((e) =>
          handleFirestoreError(e, OperationType.WRITE, 'settings/general')
        );
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/general');
    }
  );

  return unsubscribe;
}

// Save single platform
export async function savePlatformToFirestore(platform: Platform): Promise<void> {
  const docRef = doc(db, 'platforms', platform.id);
  try {
    await setDoc(docRef, platform);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `platforms/${platform.id}`);
    throw err;
  }
}

// Save all platforms (e.g. on reorder or bulk save)
export async function saveAllPlatformsToFirestore(platforms: Platform[]): Promise<void> {
  const batch = writeBatch(db);
  platforms.forEach((p) => {
    const docRef = doc(db, 'platforms', p.id);
    batch.set(docRef, p);
  });
  try {
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'platforms (batch)');
    throw err;
  }
}

// Delete single platform
export async function deletePlatformFromFirestore(platformId: string): Promise<void> {
  const docRef = doc(db, 'platforms', platformId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `platforms/${platformId}`);
    throw err;
  }
}

// Save site settings
export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const settingsDoc = doc(db, 'settings', 'general');
  try {
    await setDoc(settingsDoc, settings);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    throw err;
  }
}

// Seed initial default platforms into Cloud Firestore
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'platforms'));
    if (snapshot.empty) {
      console.log('Seeding initial platforms to Firestore...');
      const batch = writeBatch(db);
      defaultPlatforms.forEach((p) => {
        const docRef = doc(db, 'platforms', p.id);
        batch.set(docRef, p);
      });
      await batch.commit();
      await setDoc(doc(db, 'settings', 'general'), defaultSettings);
      console.log('Firestore initial seed complete.');
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'seed');
  }
}
