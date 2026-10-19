import { Platform, SiteSettings } from '../types';
import { defaultPlatforms, defaultSettings } from '../data/defaultPlatforms';

const STORAGE_KEY_PLATFORMS = 'gb_study_platforms_v1';
const STORAGE_KEY_SETTINGS = 'gb_study_settings_v1';

export const storageService = {
  getPlatforms(): Platform[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PLATFORMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading platforms from storage:', e);
    }
    return defaultPlatforms;
  },

  savePlatforms(platforms: Platform[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(platforms));
      // Try background sync with server if available
      fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms }),
      }).catch(() => {
        // Silent catch if backend server not running
      });
    } catch (e) {
      console.error('Error saving platforms to storage:', e);
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
        // Migrate default passcode to GBADMIN2026 if it was older default
        if (!result.adminPasscode || result.adminPasscode === 'gbstudy123' || result.adminPasscode === 'admin123') {
          result.adminPasscode = 'GBADMIN2026';
        }
        return result;
      }
    } catch (e) {
      console.warn('Error reading settings from storage:', e);
    }
    return defaultSettings;
  },

  saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      // Try background sync with server if available
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      }).catch(() => {
        // Silent catch
      });
    } catch (e) {
      console.error('Error saving settings to storage:', e);
    }
  },

  resetDefaults(): { platforms: Platform[]; settings: SiteSettings } {
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(defaultPlatforms));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
    } catch (e) {
      console.error('Error resetting storage:', e);
    }
    return {
      platforms: defaultPlatforms,
      settings: defaultSettings,
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

  importConfig(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.platforms && Array.isArray(parsed.platforms)) {
        this.savePlatforms(parsed.platforms);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },
};
