// client/src/shared/stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  hitSounds: boolean;
  backgroundMusic: boolean;
  metronome: boolean;
  keyboardSounds: boolean;
  uiSounds: boolean;
}

interface AppearanceSettings {
  theme: 'dark' | 'light' | 'auto';
  backgroundType: 'animated' | 'static' | 'particles' | 'minimal';
  backgroundIntensity: number;
  mouseTrailEnabled: boolean;
  mouseTrailColor: string;
  mouseTrailSize: number;
  mouseTrailLength: number;
  particleCount: number;
  animationSpeed: number;
  uiTransparency: number;
  colorScheme: 'default' | 'neon' | 'pastel' | 'monochrome';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

interface ControlsSettings {
  keyBindings: { [key: string]: string };
  sensitivity: number;
  doubleClickSpeed: number;
  holdThreshold: number;
  gestureControls: boolean;
  gamepadEnabled: boolean;
  gamepadDeadzone: number;
}

interface OnlineSettings {
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  allowPartyInvites: boolean;
  showRealTimeStats: boolean;
  autoJoinParties: boolean;
  chatFiltering: boolean;
  voiceChat: boolean;
  pushToTalk: boolean;
  microphoneVolume: number;
}

interface PerformanceSettings {
  targetFPS: 60 | 120 | 144 | 240;
  vsync: boolean;
  antiAliasing: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  backgroundAnimations: boolean;
  hardwareAcceleration: boolean;
}

interface NotificationSettings {
  gameNotifications: boolean;
  friendNotifications: boolean;
  achievementNotifications: boolean;
  tournamentNotifications: boolean;
  systemNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  notificationVolume: number;
}

interface GameplaySettings {
  timingWindow: 'strict' | 'normal' | 'relaxed';
  visualFeedback: boolean;
  scoreDisplay: boolean;
  comboCounter: boolean;
  accuracyMeter: boolean;
  pauseOnFocusLoss: boolean;
  autoRetry: boolean;
  skipIntros: boolean;
  showFPS: boolean;
  debugMode: boolean;
}

interface AccountSettings {
  username: string;
  email: string;
  profileVisibility: 'public' | 'friends' | 'private';
  showStats: boolean;
  showAchievements: boolean;
  allowSpectators: boolean;
  shareReplays: boolean;
}

interface InputSettings {
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
  inputBuffering: boolean;
  inputDelay: number;
  multiKeyInput: boolean;
  ghostKeyPrevention: boolean;
  calibrationOffset: number;
}

interface LanguageSettings {
  language: string;
  region: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: string;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
  performanceMetrics: boolean;
  personalizedAds: boolean;
  cookieConsent: boolean;
}

interface DataSettings {
  cloudSync: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  storageLocation: 'local' | 'cloud';
  dataRetention: number;
  clearCache: boolean;
}

interface SettingsState {
  audio: AudioSettings;
  appearance: AppearanceSettings;
  controls: ControlsSettings;
  online: OnlineSettings;
  performance: PerformanceSettings;
  notifications: NotificationSettings;
  gameplay: GameplaySettings;
  account: AccountSettings;
  input: InputSettings;
  language: LanguageSettings;
  privacy: PrivacySettings;
  data: DataSettings;
  
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  updateAppearanceSettings: (settings: Partial<AppearanceSettings>) => void;
  updateControlsSettings: (settings: Partial<ControlsSettings>) => void;
  updateOnlineSettings: (settings: Partial<OnlineSettings>) => void;
  updatePerformanceSettings: (settings: Partial<PerformanceSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateGameplaySettings: (settings: Partial<GameplaySettings>) => void;
  updateAccountSettings: (settings: Partial<AccountSettings>) => void;
  updateInputSettings: (settings: Partial<InputSettings>) => void;
  updateLanguageSettings: (settings: Partial<LanguageSettings>) => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  updateDataSettings: (settings: Partial<DataSettings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    effectsVolume: 85,
    hitSounds: true,
    backgroundMusic: true,
    metronome: false,
    keyboardSounds: true,
    uiSounds: true,
  },
  appearance: {
    theme: 'dark' as const,
    backgroundType: 'animated' as const,
    backgroundIntensity: 50,
    mouseTrailEnabled: true,
    mouseTrailColor: '#ff6b9d',
    mouseTrailSize: 30,
    mouseTrailLength: 150,
    particleCount: 150,
    animationSpeed: 50,
    uiTransparency: 90,
    colorScheme: 'default' as const,
    fontSize: 'medium' as const,
    reducedMotion: false,
  },
  controls: {
    keyBindings: {
      lane1: 'a',
      lane2: 's',
      lane3: 'd',
      lane4: 'f',
      lane5: 'j',
      pause: 'Escape',
      restart: 'r',
    },
    sensitivity: 50,
    doubleClickSpeed: 300,
    holdThreshold: 150,
    gestureControls: false,
    gamepadEnabled: false,
    gamepadDeadzone: 10,
  },
  online: {
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowPartyInvites: true,
    showRealTimeStats: true,
    autoJoinParties: false,
    chatFiltering: true,
    voiceChat: false,
    pushToTalk: true,
    microphoneVolume: 50,
  },
  performance: {
    targetFPS: 60 as const,
    vsync: true,
    antiAliasing: true,
    particleQuality: 'medium' as const,
    shadowQuality: 'medium' as const,
    textureQuality: 'high' as const,
    backgroundAnimations: true,
    hardwareAcceleration: true,
  },
  notifications: {
    gameNotifications: true,
    friendNotifications: true,
    achievementNotifications: true,
    tournamentNotifications: true,
    systemNotifications: true,
    soundNotifications: true,
    desktopNotifications: false,
    emailNotifications: false,
    notificationVolume: 60,
  },
  gameplay: {
    timingWindow: 'normal' as const,
    visualFeedback: true,
    scoreDisplay: true,
    comboCounter: true,
    accuracyMeter: true,
    pauseOnFocusLoss: true,
    autoRetry: false,
    skipIntros: false,
    showFPS: false,
    debugMode: false,
  },
  account: {
    username: 'Player',
    email: '',
    profileVisibility: 'public' as const,
    showStats: true,
    showAchievements: true,
    allowSpectators: true,
    shareReplays: true,
  },
  input: {
    keyboardLayout: 'qwerty' as const,
    inputBuffering: true,
    inputDelay: 0,
    multiKeyInput: true,
    ghostKeyPrevention: true,
    calibrationOffset: 0,
  },
  language: {
    language: 'en',
    region: 'US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h' as const,
    numberFormat: 'en-US',
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    crashReports: true,
    performanceMetrics: true,
    personalizedAds: false,
    cookieConsent: true,
  },
  data: {
    cloudSync: true,
    autoBackup: true,
    backupFrequency: 'weekly' as const,
    storageLocation: 'cloud' as const,
    dataRetention: 90,
    clearCache: false,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateAudioSettings: (settings) =>
        set((state) => ({
          audio: { ...state.audio, ...settings },
        })),
        
      updateAppearanceSettings: (settings) =>
        set((state) => ({
          appearance: { ...state.appearance, ...settings },
        })),
        
      updateControlsSettings: (settings) =>
        set((state) => ({
          controls: { ...state.controls, ...settings },
        })),
        
      updateOnlineSettings: (settings) =>
        set((state) => ({
          online: { ...state.online, ...settings },
        })),
        
      updatePerformanceSettings: (settings) =>
        set((state) => ({
          performance: { ...state.performance, ...settings },
        })),
        
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),
        
      updateGameplaySettings: (settings) =>
        set((state) => ({
          gameplay: { ...state.gameplay, ...settings },
        })),
        
      updateAccountSettings: (settings) =>
        set((state) => ({
          account: { ...state.account, ...settings },
        })),
        
      updateInputSettings: (settings) =>
        set((state) => ({
          input: { ...state.input, ...settings },
        })),
        
      updateLanguageSettings: (settings) =>
        set((state) => ({
          language: { ...state.language, ...settings },
        })),
        
      updatePrivacySettings: (settings) =>
        set((state) => ({
          privacy: { ...state.privacy, ...settings },
        })),
        
      updateDataSettings: (settings) =>
        set((state) => ({
          data: { ...state.data, ...settings },
        })),
        
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'keyjam-settings',
    }
  )
);