// client/src/ui/settings/LanguageSettings.tsx
import React from 'react';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { SettingsSection } from '../../shared/components/settings/SettingsSection';
import { SelectDropdown } from '../../shared/components/settings/SelectDropdown';
import { SettingsContainer } from '../../shared/components/settings/SettingsContainer';

export const LanguageSettings: React.FC = () => {
  const { language, updateLanguageSettings } = useSettingsStore();

  const languageOptions = [
    { value: 'en', label: 'English', description: 'English (US)' },
    { value: 'es', label: 'Español', description: 'Spanish' },
    { value: 'fr', label: 'Français', description: 'French' },
    { value: 'de', label: 'Deutsch', description: 'German' },
    { value: 'it', label: 'Italiano', description: 'Italian' },
    { value: 'pt', label: 'Português', description: 'Portuguese' },
    { value: 'ru', label: 'Русский', description: 'Russian' },
    { value: 'ja', label: '日本語', description: 'Japanese' },
    { value: 'ko', label: '한국어', description: 'Korean' },
    { value: 'zh', label: '中文', description: 'Chinese' },
  ];

  const regionOptions = [
    { value: 'US', label: 'United States', description: 'North America' },
    { value: 'EU', label: 'Europe', description: 'European Union' },
    { value: 'AS', label: 'Asia', description: 'Asia Pacific' },
    { value: 'SA', label: 'South America', description: 'South America' },
    { value: 'OC', label: 'Oceania', description: 'Australia/New Zealand' },
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', description: '12/31/2023 (US format)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', description: '31/12/2023 (European format)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', description: '2023-12-31 (ISO format)' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY', description: '31 Dec 2023' },
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12 Hour', description: '1:30 PM' },
    { value: '24h', label: '24 Hour', description: '13:30' },
  ];

  const numberFormatOptions = [
    { value: 'en-US', label: 'US Format', description: '1,234.56' },
    { value: 'en-GB', label: 'UK Format', description: '1,234.56' },
    { value: 'de-DE', label: 'German Format', description: '1.234,56' },
    { value: 'fr-FR', label: 'French Format', description: '1 234,56' },
  ];

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Language & Region" 
        description="Choose your language and regional preferences"
        icon="🌍"
      >
        <SelectDropdown
          value={language.language}
          onChange={(lang) => updateLanguageSettings({ language: lang })}
          options={languageOptions}
          label="Display Language"
          description="Interface and menu language"
        />

        <SelectDropdown
          value={language.region}
          onChange={(region) => updateLanguageSettings({ region })}
          options={regionOptions}
          label="Region"
          description="Your geographic region for matchmaking"
        />
      </SettingsSection>

      <SettingsSection 
        title="Format Preferences" 
        description="Customize how dates, times, and numbers are displayed"
        icon="📅"
      >
        <SelectDropdown
          value={language.dateFormat}
          onChange={(dateFormat) => updateLanguageSettings({ dateFormat })}
          options={dateFormatOptions}
          label="Date Format"
          description="How dates are displayed"
        />

        <SelectDropdown
          value={language.timeFormat}
          onChange={(timeFormat) => updateLanguageSettings({ timeFormat: timeFormat as any })}
          options={timeFormatOptions}
          label="Time Format"
          description="12 or 24 hour time display"
        />

        <SelectDropdown
          value={language.numberFormat}
          onChange={(numberFormat) => updateLanguageSettings({ numberFormat })}
          options={numberFormatOptions}
          label="Number Format"
          description="How numbers and decimals are formatted"
        />
      </SettingsSection>

      <SettingsSection 
        title="Language Pack Management" 
        description="Download and manage language packs"
        icon="📦"
      >
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
            📥 Download Language Packs
          </button>
          <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
            🔄 Update Language Packs
          </button>
          <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
            🗑️ Remove Unused Packs
          </button>
        </div>
      </SettingsSection>
    </SettingsContainer>
  );
};