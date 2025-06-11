import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';
import { NumberInput } from '@/shared/components/settings/NumberInput';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const DataSettings: React.FC = () => {
  const { data, updateDataSettings } = useSettingsStore();

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Backup every day' },
    { value: 'weekly', label: 'Weekly', description: 'Backup every week' },
    { value: 'monthly', label: 'Monthly', description: 'Backup every month' },
  ];

  const storageLocationOptions = [
    { value: 'local', label: 'Local Storage', description: 'Store data on this device only' },
    { value: 'cloud', label: 'Cloud Storage', description: 'Sync data across devices' },
  ];

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Cloud Sync & Backup" 
        description="Manage your data synchronization and backups"
        icon="☁️"
      >
        <ToggleSwitch
          enabled={data.cloudSync}
          onChange={(cloudSync) => updateDataSettings({ cloudSync })}
          label="Cloud Sync"
          description="Synchronize your data across devices"
        />

        <ToggleSwitch
          enabled={data.autoBackup}
          onChange={(autoBackup) => updateDataSettings({ autoBackup })}
          label="Automatic Backup"
          description="Automatically backup your progress and settings"
        />

        {data.autoBackup && (
          <SelectDropdown
            value={data.backupFrequency}
            onChange={(backupFrequency) => updateDataSettings({ backupFrequency: backupFrequency as any })}
            options={backupFrequencyOptions}
            label="Backup Frequency"
            description="How often to create backups"
          />
        )}

        <SelectDropdown
          value={data.storageLocation}
          onChange={(storageLocation) => updateDataSettings({ storageLocation: storageLocation as any })}
          options={storageLocationOptions}
          label="Primary Storage Location"
          description="Where to store your game data"
        />
      </SettingsSection>

      <SettingsSection 
        title="Data Retention" 
        description="Control how long data is kept"
        icon="🗄️"
      >
        <NumberInput
          value={data.dataRetention}
          onChange={(dataRetention) => updateDataSettings({ dataRetention })}
          label="Data Retention Period"
          description="Days to keep replay and performance data"
          min={1}
          max={365}
          unit="days"
        />
      </SettingsSection>

      <SettingsSection 
        title="Storage Management" 
        description="Manage local storage and cache"
        icon="💾"
      >
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Game Data</div>
                <div className="text-white font-semibold">2.4 MB</div>
              </div>
              <div>
                <div className="text-gray-400">Replays</div>
                <div className="text-white font-semibold">15.7 MB</div>
              </div>
              <div>
                <div className="text-gray-400">Cache</div>
                <div className="text-white font-semibold">8.2 MB</div>
              </div>
              <div>
                <div className="text-gray-400">Total</div>
                <div className="text-white font-semibold">26.3 MB</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              📤 Export All Data
            </button>
            <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
              📥 Import Data
            </button>
            <button className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
              🧹 Clear Cache
            </button>
            <button className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
              🗑️ Clear Old Replays
            </button>
            <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
              ⚠️ Reset All Data
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Sync Status" 
        description="Current synchronization status"
        icon="🔄"
      >
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Last Sync</span>
            <span className="text-green-400">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Sync Status</span>
            <span className="text-green-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Next Backup</span>
            <span className="text-blue-400">In 6 hours</span>
          </div>
        </div>
        
        <button className="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
          🔄 Sync Now
        </button>
      </SettingsSection>
    </SettingsContainer>
  );
};