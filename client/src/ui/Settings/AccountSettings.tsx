import React, { useState } from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const AccountSettings: React.FC = () => {
  const { account, updateAccountSettings } = useSettingsStore();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(account.username);

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to everyone' },
    { value: 'friends', label: 'Friends Only', description: 'Only friends can see your profile' },
    { value: 'private', label: 'Private', description: 'Hidden from all users' },
  ];

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      updateAccountSettings({ username: tempUsername.trim() });
      setIsEditingUsername(false);
    }
  };

  const handleUsernameCancel = () => {
    setTempUsername(account.username);
    setIsEditingUsername(false);
  };

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Profile Information" 
        description="Manage your account details"
        icon="👤"
      >
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-white font-medium">Username</div>
              <div className="text-sm text-gray-400">Your display name</div>
            </div>
            {!isEditingUsername ? (
              <button
                onClick={() => setIsEditingUsername(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
              >
                {account.username}
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                />
                <button
                  onClick={handleUsernameSubmit}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
                >
                  ✓
                </button>
                <button
                  onClick={handleUsernameCancel}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                >
                  ✗
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="py-3">
          <div className="text-white font-medium mb-2">Email</div>
          <div className="text-sm text-gray-400 mb-2">Account email address</div>
          <input
            type="email"
            value={account.email}
            onChange={(e) => updateAccountSettings({ email: e.target.value })}
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Privacy Settings" 
        description="Control who can see your information"
        icon="🔒"
      >
        <SelectDropdown
          value={account.profileVisibility}
          onChange={(profileVisibility) => updateAccountSettings({ profileVisibility: profileVisibility as any })}
          options={visibilityOptions}
          label="Profile Visibility"
          description="Who can view your profile and stats"
        />

        <ToggleSwitch
          enabled={account.showStats}
          onChange={(showStats) => updateAccountSettings({ showStats })}
          label="Show Statistics"
          description="Display your game statistics on profile"
        />

        <ToggleSwitch
          enabled={account.showAchievements}
          onChange={(showAchievements) => updateAccountSettings({ showAchievements })}
          label="Show Achievements"
          description="Display unlocked achievements on profile"
        />

        <ToggleSwitch
          enabled={account.allowSpectators}
          onChange={(allowSpectators) => updateAccountSettings({ allowSpectators })}
          label="Allow Spectators"
          description="Let others watch your gameplay"
        />

        <ToggleSwitch
          enabled={account.shareReplays}
          onChange={(shareReplays) => updateAccountSettings({ shareReplays })}
          label="Share Replays"
          description="Automatically upload replays to community"
        />
      </SettingsSection>

      <SettingsSection 
        title="Account Actions" 
        description="Manage your account"
        icon="⚙️"
      >
        <div className="space-y-3">
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
            Change Password
          </button>
          <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors">
            Export Data
          </button>
          <button className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm font-medium transition-colors">
            Download Profile Backup
          </button>
          <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </SettingsSection>
    </SettingsContainer>
  );
};