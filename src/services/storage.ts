import { Platform, SiteSettings } from '../types';
import { defaultPlatforms, defaultSettings } from '../data/defaultPlatforms';
import {
  saveAllPlatformsToFirestore,
  saveSettingsToFirestore,
  sanitizePlatform,
  sanitizeSettings,
} from './firebase';

const STORAGE_KEY_PLATFORMS = 'gb_study_platforms_v1';
const STORAGE_KEY_SETTINGS = 'gb_study_settings_v1';

export const storageService = {
  getPlatforms(): Platform[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PLATFORMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => sanitizePlatform(p));
        }
      }
    } catch (e) {
      console.warn('Error reading platforms from storage:', e);
    }
    return defaultPlatforms.map((p) => sanitizePlatform(p));
  },

  async savePlatforms(platforms: Platform[]): Promise<void> {
    const cleaned = platforms.map((p, i) => sanitizePlatform({ ...p, order: i + 1 }));
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(cleaned));
    } catch (e) {
      console.error('Error saving platforms to localStorage:', e);
    }

    // Direct synchronization to Server API (Broadcasts via SSE instantly to all users)
    try {
      await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: cleaned }),
      });
    } catch (err) {
      console.warn('Server API sync error:', err);
    }

    // Direct synchronization to Cloud Firestore
    try {
      await saveAllPlatformsToFirestore(cleaned);
    } catch (err) {
      console.warn('Firestore sync note:', err);
    }
  },

  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        const result = {
          ...defaultSettings,
          ...parsed,
          telegramPopup: {
            ...defaultSettings.telegramPopup,
            ...(parsed.telegramPopup || {}),
          },
          accessKeySettings: {
            ...defaultSettings.accessKeySettings,
            ...(parsed.accessKeySettings || {}),
          },
        };
        if (!result.adminPasscode || result.adminPasscode === 'gbstudy123' || result.adminPasscode === 'admin123') {
          result.adminPasscode = 'GBADMIN2026';
        }
        return sanitizeSettings(result);
      }
    } catch (e) {
      console.warn('Error reading settings from storage:', e);
    }
    return sanitizeSettings(defaultSettings);
  },

  async saveSettings(settings: SiteSettings): Promise<void> {
    const clean = sanitizeSettings(settings);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(clean));
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }

    // Direct synchronization to Server API (Broadcasts via SSE instantly to all users)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: clean }),
      });
    } catch (err) {
      console.warn('Server settings sync error:', err);
    }

    // Direct synchronization to Cloud Firestore
    try {
      await saveSettingsToFirestore(clean);
    } catch (err) {
      console.warn('Firestore settings sync note:', err);
    }
  },

  async resetDefaults(): Promise<{ platforms: Platform[]; settings: SiteSettings }> {
    const cleanPlatforms = defaultPlatforms.map((p, i) => sanitizePlatform({ ...p, order: i + 1 }));
    const cleanSettings = sanitizeSettings(defaultSettings);
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(cleanPlatforms));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(cleanSettings));
    } catch (e) {
      console.error('Error resetting storage:', e);
    }

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.error('Error calling reset API:', e);
    }

    try {
      await saveAllPlatformsToFirestore(cleanPlatforms);
      await saveSettingsToFirestore(cleanSettings);
    } catch (err) {
      console.warn('Error resetting Firestore defaults:', err);
    }

    return {
      platforms: cleanPlatforms,
      settings: cleanSettings,
    };
  },

  exportConfig(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platforms: this.getPlatforms(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  async importConfig(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.platforms && Array.isArray(parsed.platforms)) {
        await this.savePlatforms(parsed.platforms);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        await this.saveSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },
};
