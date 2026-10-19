/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { PlatformCard } from './components/PlatformCard';
import { SidebarDrawer } from './components/SidebarDrawer';
import { TelegramModal } from './components/TelegramModal';
import { AdminModal } from './components/AdminModal';
import { AccessKeyModal } from './components/AccessKeyModal';
import { InternalViewerModal } from './components/InternalViewerModal';
import {
  testFirestoreConnection,
  subscribeToPlatforms,
  subscribeToSettings,
} from './services/firebase';
import { storageService } from './services/storage';
import { Platform, SiteSettings } from './types';
import { Send, Sparkles } from 'lucide-react';

export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => storageService.getPlatforms());
  const [settings, setSettings] = useState<SiteSettings>(() => storageService.getSettings());

  // Navigation and Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAccessKeyModalOpen, setIsAccessKeyModalOpen] = useState(false);
  const [internalViewerPlatform, setInternalViewerPlatform] = useState<Platform | null>(null);

  // Access Key & Filter state
  const [currentAccessKey, setCurrentAccessKey] = useState<string>(() => {
    return localStorage.getItem('gb_study_user_key') || '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Real-time Cloud Firestore Database Sync + Connection Test
  useEffect(() => {
    // 1. Test Firestore connection on boot
    testFirestoreConnection();

    // 2. Real-time subscription to platforms from Cloud Firestore
    const unsubPlatforms = subscribeToPlatforms((livePlatforms) => {
      if (livePlatforms && livePlatforms.length > 0) {
        setPlatforms(livePlatforms);
      }
    });

    // 3. Real-time subscription to site settings from Cloud Firestore
    const unsubSettings = subscribeToSettings((liveSettings) => {
      if (liveSettings) {
        setSettings(liveSettings);
      }
    });

    // 4. Safe fallback sync with local server if running (only parse JSON)
    fetch('/api/data')
      .then((res) => {
        const ct = res.headers.get('content-type');
        if (res.ok && ct && ct.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.platforms && Array.isArray(data.platforms) && data.platforms.length > 0) {
          setPlatforms(data.platforms);
        }
        if (data && data.settings && typeof data.settings === 'object') {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});

    return () => {
      unsubPlatforms();
      unsubSettings();
    };
  }, []);

  // Show Telegram Popup on initial visit (matching video behavior)
  useEffect(() => {
    if (settings.telegramPopup.enabled) {
      const hasSeenPopup = sessionStorage.getItem('gb_study_tg_popup_seen');
      // Always show on fresh tab/session or shortly after load
      const timer = setTimeout(() => {
        setIsTelegramModalOpen(true);
        sessionStorage.setItem('gb_study_tg_popup_seen', 'true');
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [settings.telegramPopup.enabled]);

  // Save changes handler (Synchronizes with Cloud Firestore across all users)
  const handleSavePlatforms = (newPlatforms: Platform[]) => {
    setPlatforms(newPlatforms);
    storageService.savePlatforms(newPlatforms);
  };

  const handleSaveSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleResetDefaults = async () => {
    const res = await storageService.resetDefaults();
    setPlatforms(res.platforms);
    setSettings(res.settings);
  };

  // Check if user has active access key
  const hasAccessKey = useMemo(() => {
    if (!settings.accessKeySettings.enabled) return true;
    if (!currentAccessKey) return false;
    const valid = settings.accessKeySettings.validKeys.map((k) => k.toUpperCase());
    return valid.includes(currentAccessKey.toUpperCase()) || currentAccessKey === 'GBSTUDY';
  }, [settings.accessKeySettings, currentAccessKey]);

  const handleKeyValidated = (key: string) => {
    setCurrentAccessKey(key);
    localStorage.setItem('gb_study_user_key', key);
  };

  // Launch platform with configurable openMode (internal, sametab, newtab, external)
  const handleLaunchPlatform = (platform: Platform) => {
    if (settings.accessKeySettings.enabled && !hasAccessKey) {
      setIsAccessKeyModalOpen(true);
      return;
    }

    if (!platform.url) return;

    const mode = platform.openMode || 'newtab';

    if (mode === 'internal') {
      setInternalViewerPlatform(platform);
    } else if (mode === 'sametab') {
      window.location.href = platform.url;
    } else {
      // 'newtab' or 'external'
      window.open(platform.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Filter categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    platforms.forEach((p) => {
      if (p.category && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [platforms]);

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    return platforms.filter((p) => {
      if (!p.active && p.active !== undefined) return false;

      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [platforms, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#070b09] text-gray-100 flex flex-col relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Top Ambient Light */}
      <div className="fixed inset-0 radial-glow-top pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 relative z-10 pb-16">
        {/* Hero Header */}
        <HeroHeader
          settings={settings}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          onTriggerSecretAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* Platforms Grid (matching the 2-column layout in the video) */}
        <div className="mt-4">
          {filteredPlatforms.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
              {filteredPlatforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onClick={() => handleLaunchPlatform(platform)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#0c140f]/60 rounded-3xl border border-[#182b1f] p-8">
              <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-white mb-1">No platforms found</h3>
              <p className="text-xs text-gray-400 mb-4">
                Try searching for something else or browse all platforms
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Telegram Direct Floating / Callout Banner at bottom */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0a1610] via-[#0d2216] to-[#0a1610] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#0088cc] flex items-center justify-center shrink-0">
              <Send className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white">Join Official Telegram Channel</h4>
              <p className="text-xs text-gray-400">
                Get daily free batch links, PDF notes &amp; important updates
              </p>
            </div>
          </div>

          <a
            href={settings.telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
          >
            <span>Join @GBFreestudy</span>
            <Send className="w-3.5 h-3.5 fill-current" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#122117] py-6 px-4 text-center text-xs text-gray-500 relative z-10 bg-[#060a08]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md overflow-hidden border border-emerald-500/40">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://i.ibb.co/mVjJG7Zg/1791541921524.png';
                }}
              />
            </div>
            <span className="font-bold text-gray-400">{settings.siteName}</span>
            <span>—</span>
            <span className="text-gray-500">Free Education for All</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href={settings.telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Community</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Telegram Community Popup Modal */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        settings={settings}
      />

      {/* Left Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        platforms={platforms}
        settings={settings}
        onSelectPlatform={handleLaunchPlatform}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAccessKey={() => setIsAccessKeyModalOpen(true)}
        hasAccessKey={hasAccessKey}
      />

      {/* Access Key Modal */}
      <AccessKeyModal
        isOpen={isAccessKeyModalOpen}
        onClose={() => setIsAccessKeyModalOpen(false)}
        settings={settings}
        onKeyValidated={handleKeyValidated}
        currentKey={currentAccessKey}
      />

      {/* Admin Control Panel Modal (Secretly unlocked via 20 taps on GB STUDY center logo) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        platforms={platforms}
        settings={settings}
        onSavePlatforms={handleSavePlatforms}
        onSaveSettings={handleSaveSettings}
        onResetDefaults={handleResetDefaults}
        onTestTelegramPopup={() => setIsTelegramModalOpen(true)}
      />

      {/* Internal Web Viewer Modal for platforms configured with openMode: 'internal' */}
      <InternalViewerModal
        platform={internalViewerPlatform}
        onClose={() => setInternalViewerPlatform(null)}
      />
    </div>
  );
}
