import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link,
  Send,
  Sliders,
  RotateCcw,
  Download,
  Upload,
  Check,
  Eye,
  Key,
  Star,
  Layers,
} from 'lucide-react';
import { Platform, SiteSettings } from '../types';
import { platformPresets } from '../data/defaultPlatforms';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: Platform[];
  settings: SiteSettings;
  onSavePlatforms: (platforms: Platform[]) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  onResetDefaults: () => void;
  onTestTelegramPopup: () => void;
}

const COLOR_OPTIONS = [
  { name: 'Emerald', hex: '#22c55e' },
  { name: 'Cyan / Sky', hex: '#00f0ff' },
  { name: 'Yellow', hex: '#ffd600' },
  { name: 'Red', hex: '#ff3b57' },
  { name: 'Orange', hex: '#ff9100' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'White', hex: '#ffffff' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  platforms,
  settings,
  onSavePlatforms,
  onSaveSettings,
  onResetDefaults,
  onTestTelegramPopup,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [activeTab, setActiveTab] = useState<'platforms' | 'telegram' | 'branding' | 'backup'>('platforms');

  // Form states for Add/Edit platform
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);
  const [icon, setIcon] = useState('');
  const [glowColor, setGlowColor] = useState('#22c55e');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [openMode, setOpenMode] = useState<'internal' | 'newtab' | 'sametab' | 'external'>('newtab');

  // Telegram settings form
  const [telegramSettings, setTelegramSettings] = useState(settings.telegramPopup);
  const [telegramUrl, setTelegramUrl] = useState(settings.telegramChannelUrl);

  // Branding settings form
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || 'https://i.ibb.co/Q3g9fGSt/1791541921524.png');
  const [newAdminPasscode, setNewAdminPasscode] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = settings.adminPasscode || 'GBADMIN2026';
    if (passcode === correctCode || passcode === 'GBADMIN2026') {
      setIsAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Galat Passcode! Default password hai: GBADMIN2026');
    }
  };

  const handleOpenAddForm = () => {
    setEditingPlatformId(null);
    setName('');
    setUrl('');
    setIcon('');
    setGlowColor('#22c55e');
    setCategory('General');
    setDescription('');
    setOpenMode('newtab');
    setOrderNum(platforms.length + 1);
    setIsFormOpen(true);
  };

  const handleEditPlatform = (platform: Platform) => {
    const currentIdx = platforms.findIndex((p) => p.id === platform.id);
    setEditingPlatformId(platform.id);
    setName(platform.name);
    setUrl(platform.url);
    setIcon(platform.icon);
    setGlowColor(platform.glowColor || '#22c55e');
    setCategory(platform.category || '');
    setDescription(platform.description || '');
    setOpenMode(platform.openMode || 'newtab');
    setOrderNum(platform.order || currentIdx + 1);
    setIsFormOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotify('Kripya valid image file chunein (JPG, PNG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize to clean 160x160 thumbnail for fast storage
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 160, 160);
          const dataUrl = canvas.toDataURL('image/png', 0.9);
          setIcon(dataUrl);
          showNotify('Photo upload ho gayi aur icon set ho gaya!');
        }
      };
      img.src = uploadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePlatformForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      showNotify('Please enter platform name and URL');
      return;
    }

    let resolvedIcon = icon.trim();
    if (!resolvedIcon) {
      // Create SVG fallback with initials
      resolvedIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230c140f"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="28" fill="${encodeURIComponent(
        glowColor
      )}" text-anchor="middle">${encodeURIComponent(name.substring(0, 2).toUpperCase())}</text></svg>`;
    }

    const targetPos = Math.max(1, Math.min(orderNum || 1, platforms.length + (editingPlatformId ? 0 : 1)));
    let updatedList: Platform[] = [...platforms];

    if (editingPlatformId) {
      const currentIdx = updatedList.findIndex((p) => p.id === editingPlatformId);
      const existing = updatedList[currentIdx];
      const updatedItem: Platform = {
        ...existing,
        name: name.trim(),
        url: url.trim(),
        icon: resolvedIcon,
        glowColor,
        category: category.trim(),
        description: description.trim(),
        openMode,
        order: targetPos,
      };

      if (currentIdx !== -1) {
        updatedList.splice(currentIdx, 1);
      }
      updatedList.splice(targetPos - 1, 0, updatedItem);
      showNotify(`Updated "${name}" at Position #${targetPos}`);
    } else {
      const newPlatform: Platform = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        url: url.trim(),
        icon: resolvedIcon,
        glowColor,
        category: category.trim() || 'General',
        description: description.trim(),
        order: targetPos,
        active: true,
        openMode,
      };
      updatedList.splice(targetPos - 1, 0, newPlatform);
      showNotify(`Added "${name}" at Position #${targetPos}`);
    }

    // Re-index all orders cleanly to 1, 2, 3...
    updatedList = updatedList.map((p, i) => ({
      ...p,
      order: i + 1,
    }));

    onSavePlatforms(updatedList);
    setIsFormOpen(false);
  };

  const handleDeletePlatform = (id: string, platformName: string) => {
    if (confirm(`Are you sure you want to delete "${platformName}"?`)) {
      const updated = platforms.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i + 1 }));
      onSavePlatforms(updated);
      showNotify(`Deleted ${platformName}`);
    }
  };

  const handleClearAllPlatforms = () => {
    if (confirm('Kya aap sabhi platforms ko hatana chahte hain taaki aap 1 number se apne naye platforms jod sakein?')) {
      onSavePlatforms([]);
      showNotify('Sabhi platforms hata diye gaye! Ab naya platform 1 number se judega.');
    }
  };

  const handleMovePlatform = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= platforms.length) return;
    const updated = [...platforms];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    const reindexed = updated.map((p, i) => ({ ...p, order: i + 1 }));
    onSavePlatforms(reindexed);
  };

  const handleMoveToTop = (index: number) => {
    if (index === 0) return;
    const updated = [...platforms];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    const reindexed = updated.map((p, i) => ({ ...p, order: i + 1 }));
    onSavePlatforms(reindexed);
    showNotify(`"${item.name}" ko Position #1 par set kar diya!`);
  };

  const handleAddPreset = (preset: typeof platformPresets[0]) => {
    const newPlatform: Platform = {
      id: `preset-${Date.now()}`,
      name: preset.name,
      url: preset.url,
      icon: preset.icon,
      glowColor: preset.glowColor,
      category: preset.category,
      description: `${preset.name} official batches`,
      order: platforms.length + 1,
      active: true,
    };
    onSavePlatforms([...platforms, newPlatform]);
    showNotify(`Added ${preset.name} at Position #${platforms.length + 1}!`);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SiteSettings = {
      ...settings,
      telegramChannelUrl: telegramUrl.trim(),
      telegramPopup: {
        ...telegramSettings,
      },
    };
    onSaveSettings(updatedSettings);
    showNotify('Telegram settings saved successfully!');
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SiteSettings = {
      ...settings,
      siteName: siteName.trim() || 'GB STUDY',
      tagline: tagline.trim(),
      logoUrl: logoUrl.trim() || 'https://i.ibb.co/Q3g9fGSt/1791541921524.png',
      adminPasscode: newAdminPasscode.trim() || settings.adminPasscode,
    };
    onSaveSettings(updatedSettings);
    showNotify('Branding settings saved successfully!');
    if (newAdminPasscode.trim()) {
      setNewAdminPasscode('');
    }
  };

  const handleExportJSON = () => {
    const exportObj = { platforms, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `gb-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(href);
    showNotify('Configuration exported successfully!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.platforms && Array.isArray(parsed.platforms)) {
          onSavePlatforms(parsed.platforms);
        }
        if (parsed.settings && typeof parsed.settings === 'object') {
          onSaveSettings(parsed.settings);
        }
        showNotify('Configuration restored successfully!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-[24px] bg-[#090f0c] border border-[#1b3323] shadow-2xl flex flex-col overflow-hidden text-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#16271c] flex items-center justify-between bg-[#0c1610]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                GB STUDY Admin Control Panel
              </h2>
              <p className="text-xs text-gray-400">Add, edit, reorder platforms, URLs, icons & Telegram popups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-500/90 text-black px-4 py-2 text-xs font-bold flex items-center justify-between transition-all">
            <span>{notification}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Passcode Screen */
          <div className="p-8 max-w-sm mx-auto text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#122318] border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Admin Passcode Required</h3>
            <p className="text-xs text-gray-400 mb-6">
              Enter admin passcode to manage platforms and settings. (Default passcode: <span className="text-emerald-400 font-mono font-semibold">GBADMIN2026</span>)
            </p>
            {passcodeError && (
              <div className="text-xs text-red-400 mb-4 bg-red-950/50 p-2.5 rounded-xl border border-red-800/60">
                {passcodeError}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 rounded-xl bg-[#101b14] border border-[#1d3525] focus:border-emerald-500 text-center text-lg tracking-widest text-white outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transition-all cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#16271c] bg-[#0c1610] overflow-x-auto">
              <button
                onClick={() => setActiveTab('platforms')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'platforms'
                    ? 'bg-[#090f0c] text-emerald-400 border-t-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Platforms Manager ({platforms.length})
              </button>
              <button
                onClick={() => setActiveTab('telegram')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'telegram'
                    ? 'bg-[#090f0c] text-emerald-400 border-t-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Telegram &amp; Popup
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'branding'
                    ? 'bg-[#090f0c] text-emerald-400 border-t-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Site Branding
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'backup'
                    ? 'bg-[#090f0c] text-emerald-400 border-t-2 border-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Backup / Reset
              </button>
            </div>

            {/* Tab 1: Platforms Manager */}
            {activeTab === 'platforms' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1711] p-3 rounded-2xl border border-[#1b3123]">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      Active Platforms ({platforms.length})
                    </h4>
                    <p className="text-xs text-gray-400">
                      Platforms usi kram (order #1, #2, #3...) me students ko dikhenge
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {platforms.length > 0 && (
                      <button
                        onClick={handleClearAllPlatforms}
                        className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/40 text-xs font-semibold transition-all cursor-pointer"
                        title="Sabhi platforms hatayein"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      onClick={handleOpenAddForm}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Platform</span>
                    </button>
                  </div>
                </div>

                {/* Form Modal for Add / Edit */}
                {isFormOpen && (
                  <form
                    onSubmit={handleSavePlatformForm}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0e1913] border-2 border-emerald-500/50 space-y-4 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between border-b border-[#1e3425] pb-3">
                      <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                        {editingPlatformId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingPlatformId ? 'Edit Platform Details' : 'Add New Platform'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Platform Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Physics Wallah, Careerwill..."
                          className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Platform URL / Link *
                        </label>
                        <input
                          type="url"
                          required
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://... or https://t.me/..."
                          className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Position / Order Number */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Platform Position / Number (Kramank) *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={platforms.length + (editingPlatformId ? 0 : 1)}
                            value={orderNum}
                            onChange={(e) => setOrderNum(parseInt(e.target.value) || 1)}
                            className="w-24 px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs font-mono font-bold text-center outline-none focus:border-emerald-500"
                          />
                          <span className="text-[11px] text-emerald-400 font-medium">
                            {orderNum === 1
                              ? '🌟 Ye website par 1st number par dikhega'
                              : `Position #${orderNum} par rahega`}
                          </span>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Category / Tag
                        </label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. JEE / NEET, Govt Exams, Books..."
                          className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Glow Accent Color */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Icon Glow Color
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {COLOR_OPTIONS.map((c) => (
                            <button
                              type="button"
                              key={c.hex}
                              onClick={() => setGlowColor(c.hex)}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                glowColor === c.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          <input
                            type="color"
                            value={glowColor}
                            onChange={(e) => setGlowColor(e.target.value)}
                            className="w-6 h-6 rounded-full bg-transparent cursor-pointer p-0 border-0"
                            title="Custom color"
                          />
                        </div>
                      </div>

                      {/* Open Mode Selector (Internal, New Tab, Same Tab, External) */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                          Open Mode (Ye platform kahan khulna chahiye?) *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenMode('newtab')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              openMode === 'newtab'
                                ? 'bg-[#14281c] border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                                : 'bg-[#101b15] border-[#1d3525] text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-bold block flex items-center gap-1.5">
                              <span>🌐</span> New Tab
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              Naye tab me khulega
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenMode('internal')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              openMode === 'internal'
                                ? 'bg-[#14281c] border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                                : 'bg-[#101b15] border-[#1d3525] text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-bold block flex items-center gap-1.5">
                              <span>📱</span> In-App Viewer
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              GB STUDY ke andar hi
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenMode('sametab')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              openMode === 'sametab'
                                ? 'bg-[#14281c] border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                                : 'bg-[#101b15] border-[#1d3525] text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-bold block flex items-center gap-1.5">
                              <span>🔄</span> Same Tab
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              Isi window me redirect
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenMode('external')}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              openMode === 'external'
                                ? 'bg-[#14281c] border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                                : 'bg-[#101b15] border-[#1d3525] text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-bold block flex items-center gap-1.5">
                              <span>↗️</span> External
                            </span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              External browser app
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Icon with Photo Upload from Gallery or Link */}
                      <div className="sm:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-gray-300">
                            Platform Icon (Photo Upload karein ya Link Dalein)
                          </label>
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Gallery se Photo Lagayein</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="Ya photo link dalein (https://... ya auto-initials)"
                            className="flex-1 px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                          />
                          {/* Live preview */}
                          <div
                            className="w-12 h-12 rounded-xl bg-[#080e0a] border-2 p-0.5 flex items-center justify-center shrink-0 overflow-hidden"
                            style={{ borderColor: glowColor }}
                          >
                            {icon ? (
                              <img src={icon} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">
                                {name ? name.substring(0, 2).toUpperCase() : 'ICON'}
                              </span>
                            )}
                          </div>
                          {icon && (
                            <button
                              type="button"
                              onClick={() => setIcon('')}
                              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-white/5"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Description (Optional note for students)
                        </label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="e.g. Free video lectures, tests and PDF notes"
                          className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e3425]">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md cursor-pointer"
                      >
                        {editingPlatformId ? 'Update Platform' : 'Save Platform'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Preset Fast Add Shelf */}
                <div className="p-3.5 rounded-2xl bg-[#0c140f] border border-[#192b1f]">
                  <h5 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Quick Add Popular Platform Presets
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {platformPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleAddPreset(preset)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121c16] hover:bg-[#18261e] border border-[#213527] hover:border-emerald-500/50 text-xs text-gray-200 transition-all cursor-pointer group"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: preset.glowColor }}
                        />
                        <span className="font-semibold">{preset.name}</span>
                        <Plus className="w-3 h-3 text-emerald-400 group-hover:scale-125 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platforms List with Prominent Position Numbers and Easy Edit */}
                <div className="space-y-2">
                  {platforms.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[#0c140f] border border-[#182b1f]">
                      <p className="text-sm font-semibold text-gray-400 mb-3">Abhi koi platform nahi hai</p>
                      <button
                        onClick={handleOpenAddForm}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                      >
                        + Apna Pehla Platform (#1) Jodein
                      </button>
                    </div>
                  ) : (
                    platforms.map((platform, idx) => (
                      <div
                        key={platform.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#0c140f] border border-[#182b1f] hover:border-[#243e2d] transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Position Badge Number */}
                          <div className="flex flex-col items-center justify-center shrink-0">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black font-mono flex items-center justify-center shadow-sm">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Drag / Reorder buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleMovePlatform(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                              title="Upar le jayein"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMovePlatform(idx, 'down')}
                              disabled={idx === platforms.length - 1}
                              className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                              title="Neeche le jayein"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Icon */}
                          <div
                            className="w-11 h-11 rounded-xl bg-[#070b09] border-2 p-0.5 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
                            style={{ borderColor: platform.glowColor || '#22c55e' }}
                            onClick={() => handleEditPlatform(platform)}
                            title="Click to edit"
                          >
                            <img
                              src={platform.icon}
                              alt={platform.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          {/* Info */}
                          <div
                            className="min-w-0 flex-1 cursor-pointer"
                            onClick={() => handleEditPlatform(platform)}
                          >
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="font-bold text-sm text-white truncate hover:text-emerald-300 transition-colors">
                                {platform.name}
                              </h5>
                              {platform.category && (
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#132219] text-emerald-400 border border-[#203a29] font-medium">
                                  {platform.category}
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300">
                                {platform.openMode === 'internal'
                                  ? '📱 In-App'
                                  : platform.openMode === 'sametab'
                                  ? '🔄 Same Tab'
                                  : platform.openMode === 'external'
                                  ? '↗️ External'
                                  : '🌐 New Tab'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 truncate mt-0.5">
                              <Link className="w-3 h-3 shrink-0 text-gray-500" />
                              <span className="truncate">{platform.url}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          {idx > 0 && (
                            <button
                              onClick={() => handleMoveToTop(idx)}
                              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold transition-colors"
                              title="#1 number par le jayein"
                            >
                              <Star className="w-3 h-3 fill-current" />
                              <span>#1 Banayein</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditPlatform(platform)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-gray-200 hover:text-white bg-[#14221a] hover:bg-[#1a2d23] border border-[#203728] text-xs font-bold transition-colors cursor-pointer"
                            title="Edit Platform"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePlatform(platform.id, platform.name)}
                            className="p-1.5 rounded-xl text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Telegram & Popup Settings */}
            {activeTab === 'telegram' && (
              <form onSubmit={handleSaveTelegram} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#0c140f] border border-[#1b3123] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <Send className="w-4 h-4 text-sky-400" />
                        Telegram Channel &amp; Popup Modal
                      </h4>
                      <p className="text-xs text-gray-400">
                        Exact style popup shown to students when they open the site
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onTestTelegramPopup}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Popup Now</span>
                    </button>
                  </div>

                  {/* Channel URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Telegram Channel URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={telegramUrl}
                      onChange={(e) => setTelegramUrl(e.target.value)}
                      placeholder="https://t.me/GBFreestudy"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Enable Popup */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#121f18] border border-[#1e3425]">
                    <div>
                      <span className="text-xs font-bold text-white block">Auto Show Popup On Page Load</span>
                      <span className="text-[11px] text-gray-400">
                        Pops up when users first open the app to encourage Telegram channel joins
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={telegramSettings.enabled}
                      onChange={(e) =>
                        setTelegramSettings({ ...telegramSettings, enabled: e.target.checked })
                      }
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>

                  {/* Popup Title */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Popup Title</label>
                    <input
                      type="text"
                      value={telegramSettings.title}
                      onChange={(e) =>
                        setTelegramSettings({ ...telegramSettings, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Popup Subtext */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Popup Notice Description
                    </label>
                    <textarea
                      rows={3}
                      value={telegramSettings.description}
                      onChange={(e) =>
                        setTelegramSettings({ ...telegramSettings, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  {/* Members Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Member Count Text
                      </label>
                      <input
                        type="text"
                        value={telegramSettings.membersText}
                        onChange={(e) =>
                          setTelegramSettings({ ...telegramSettings, membersText: e.target.value })
                        }
                        placeholder="88,874 Members"
                        className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Button Action Text
                      </label>
                      <input
                        type="text"
                        value={telegramSettings.btnText}
                        onChange={(e) =>
                          setTelegramSettings({ ...telegramSettings, btnText: e.target.value })
                        }
                        placeholder="JOIN TELEGRAM"
                        className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg cursor-pointer"
                  >
                    Save Telegram Settings
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Site Branding */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveBranding} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#0c140f] border border-[#1b3123] space-y-4">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Site Identity &amp; Security
                  </h4>

                  {/* Site Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Site Name *</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="GB STUDY"
                      className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Education Must be Free For Everyone"
                      className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Logo Icon URL (Default: https://i.ibb.co/Q3g9fGSt/1791541921524.png)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://i.ibb.co/Q3g9fGSt/1791541921524.png or /logo.png"
                        className="flex-1 px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                      />
                      <div className="w-10 h-10 rounded-xl bg-[#080e0a] border border-emerald-500/40 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={logoUrl || 'https://i.ibb.co/Q3g9fGSt/1791541921524.png'}
                          alt="Logo Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Change Admin Passcode */}
                  <div className="pt-2 border-t border-[#182a1e]">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Update Admin Passcode (Current: {settings.adminPasscode})
                    </label>
                    <input
                      type="text"
                      value={newAdminPasscode}
                      onChange={(e) => setNewAdminPasscode(e.target.value)}
                      placeholder="Enter new passcode to change"
                      className="w-full px-3 py-2 rounded-xl bg-[#122119] border border-[#213a29] text-white text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg cursor-pointer"
                  >
                    Save Branding Settings
                  </button>
                </div>
              </form>
            )}

            {/* Tab 4: Backup / Reset */}
            {activeTab === 'backup' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#0c140f] border border-[#1b3123] space-y-4">
                  <h4 className="font-bold text-sm text-white">Export &amp; Import Data</h4>
                  <p className="text-xs text-gray-400">
                    You can save your platforms list, urls, and configurations as a file or restore them anytime.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="p-3.5 rounded-xl bg-[#122119] hover:bg-[#182c22] border border-[#1e3828] flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Backup JSON</span>
                    </button>
                    <label className="p-3.5 rounded-xl bg-[#122119] hover:bg-[#182c22] border border-[#1e3828] flex items-center justify-center gap-2 text-xs font-bold text-sky-400 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload &amp; Restore Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                  <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Initial Defaults
                  </h4>
                  <p className="text-xs text-gray-400">
                    Reverts all platforms back to the initial set from the video (Physics Wallah, Next Toppers, Mission JEET, etc.).
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all platforms to initial defaults?')) {
                        onResetDefaults();
                        showNotify('Reset to default platforms successful!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-800/60 transition-all cursor-pointer"
                  >
                    Reset Everything to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
