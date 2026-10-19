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

// Initialize Firebase App & Firestore Database
let dbInstance: any = null;
try {
  const app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn('Firebase initialization note:', e);
}

export const db = dbInstance;

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
  console.warn('Firestore Operation Note: ', JSON.stringify(errInfo));
}

// Clean helper to guarantee NO 'undefined' fields reach Firestore
export function sanitizePlatform(p: Partial<Platform>): Platform {
  return {
    id: String(p.id || `custom-${Date.now()}`),
    name: String(p.name || 'Platform'),
    url: String(p.url || ''),
    icon: String(p.icon || ''),
    glowColor: String(p.glowColor || '#22c55e'),
    category: String(p.category || 'General'),
    description: String(p.description || ''),
    order: typeof p.order === 'number' ? p.order : 0,
    active: p.active !== false,
    openMode: p.openMode || 'newtab',
  };
}

export function sanitizeSettings(s: Partial<SiteSettings>): SiteSettings {
  return {
    siteName: String(s.siteName || defaultSettings.siteName),
    tagline: String(s.tagline || defaultSettings.tagline),
    logoUrl: String(s.logoUrl || defaultSettings.logoUrl),
    telegramChannelUrl: String(s.telegramChannelUrl || defaultSettings.telegramChannelUrl),
    telegramPopup: {
      enabled: s.telegramPopup?.enabled !== false,
      title: String(s.telegramPopup?.title || defaultSettings.telegramPopup.title),
      description: String(s.telegramPopup?.description || defaultSettings.telegramPopup.description),
      membersText: String(s.telegramPopup?.membersText || defaultSettings.telegramPopup.membersText),
      btnText: String(s.telegramPopup?.btnText || defaultSettings.telegramPopup.btnText),
    },
    accessKeySettings: {
      enabled: Boolean(s.accessKeySettings?.enabled),
      validKeys: Array.isArray(s.accessKeySettings?.validKeys)
        ? s.accessKeySettings.validKeys
        : defaultSettings.accessKeySettings.validKeys,
      getKeyUrl: String(s.accessKeySettings?.getKeyUrl || defaultSettings.accessKeySettings.getKeyUrl),
    },
    adminPasscode: String(s.adminPasscode || defaultSettings.adminPasscode),
  };
}

// Test Connection on Startup
export async function testFirestoreConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'settings', 'general'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline fallback active.');
    }
  }
}

// Subscribe to platforms in real-time (All users receive live updates instantly)
export function subscribeToPlatforms(
  onUpdate: (platforms: Platform[]) => void
): () => void {
  if (!db) return () => {};
  try {
    const colRef = collection(db, 'platforms');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Platform[] = [];
          snapshot.forEach((d) => {
            list.push(sanitizePlatform(d.data() as Platform));
          });
          // Sort by order ascending
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          onUpdate(list);
        } else {
          // If collection is empty, seed initial defaults to Cloud Firestore
          seedInitialFirestoreData();
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'platforms');
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToPlatforms init error:', err);
    return () => {};
  }
}

// Subscribe to settings in real-time
export function subscribeToSettings(
  onUpdate: (settings: SiteSettings) => void
): () => void {
  if (!db) return () => {};
  try {
    const settingsDoc = doc(db, 'settings', 'general');
    const unsubscribe = onSnapshot(
      settingsDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate(sanitizeSettings(data as Partial<SiteSettings>));
        } else {
          // Seed default settings to Firestore
          setDoc(settingsDoc, sanitizeSettings(defaultSettings)).catch((e) =>
            handleFirestoreError(e, OperationType.WRITE, 'settings/general')
          );
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/general');
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToSettings init error:', err);
    return () => {};
  }
}

// Save all platforms: Synchronizes local list with Cloud Firestore
export async function saveAllPlatformsToFirestore(platforms: Platform[]): Promise<void> {
  if (!db) return;
  try {
    const snapshot = await getDocs(collection(db, 'platforms'));
    const remoteDocIds = new Set(snapshot.docs.map((d) => d.id));
    const localDocIds = new Set(platforms.map((p) => p.id));
    const batch = writeBatch(db);

    // 1. Delete documents that are no longer in platforms list
    for (const remoteId of remoteDocIds) {
      if (!localDocIds.has(remoteId)) {
        batch.delete(doc(db, 'platforms', remoteId));
      }
    }

    // 2. Set/Update all current platforms with clean data
    platforms.forEach((p, idx) => {
      const clean = sanitizePlatform({ ...p, order: idx + 1 });
      batch.set(doc(db, 'platforms', clean.id), clean);
    });

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'platforms');
  }
}

// Save single platform
export async function savePlatformToFirestore(platform: Platform): Promise<void> {
  if (!db) return;
  const clean = sanitizePlatform(platform);
  const docRef = doc(db, 'platforms', clean.id);
  try {
    await setDoc(docRef, clean);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `platforms/${clean.id}`);
  }
}

// Delete single platform directly from Firestore
export async function deletePlatformFromFirestore(platformId: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'platforms', platformId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `platforms/${platformId}`);
  }
}

// Save site settings to Firestore
export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  if (!db) return;
  const clean = sanitizeSettings(settings);
  const settingsDoc = doc(db, 'settings', 'general');
  try {
    await setDoc(settingsDoc, clean);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/general');
  }
}

// Seed initial platforms into Cloud Firestore
export async function seedInitialFirestoreData(): Promise<void> {
  if (!db) return;
  try {
    const snapshot = await getDocs(collection(db, 'platforms'));
    if (snapshot.empty) {
      const batch = writeBatch(db);
      defaultPlatforms.forEach((p, idx) => {
        const clean = sanitizePlatform({ ...p, order: idx + 1 });
        batch.set(doc(db, 'platforms', clean.id), clean);
      });
      await batch.commit();
      await setDoc(doc(db, 'settings', 'general'), sanitizeSettings(defaultSettings));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'seed');
  }
}
