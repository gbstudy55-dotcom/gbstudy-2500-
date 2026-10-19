export type PlatformOpenMode = 'internal' | 'newtab' | 'sametab' | 'external';

export interface Platform {
  id: string;
  name: string;
  url: string;
  icon: string;
  glowColor: string;
  category?: string;
  description?: string;
  order: number;
  active: boolean;
  openMode?: PlatformOpenMode;
  isExternal?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  telegramChannelUrl: string;
  telegramPopup: {
    enabled: boolean;
    title: string;
    description: string;
    membersText: string;
    btnText: string;
  };
  accessKeySettings: {
    enabled: boolean;
    validKeys: string[];
    getKeyUrl: string;
  };
  adminPasscode: string;
}
