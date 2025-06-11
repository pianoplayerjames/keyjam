import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const PrivacySettings: React.FC = () => {
  const { privacy, updatePrivacySettings } = useSettingsStore();

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Data Collection" 
        description="Control what data is collected and how it's used"
        icon="📊"
      >
        <ToggleSwitch
          enabled={privacy.dataCollection}
          onChange={(dataCollection) => updatePrivacySettings({ dataCollection })}
          label="Data Collection"
          description="Allow collection of gameplay data for service improvement"
        />

        <ToggleSwitch
          enabled={privacy.analytics}
          onChange={(analytics) => updatePrivacySettings({ analytics })}
          label="Analytics"
          description="Share anonymous usage statistics"
        />

        <ToggleSwitch
          enabled={privacy.crashReports}
          onChange={(crashReports) => updatePrivacySettings({ crashReports })}
          label="Crash Reports"
          description="Automatically send crash reports to help fix bugs"
        />

        <ToggleSwitch
          enabled={privacy.performanceMetrics}
          onChange={(performanceMetrics) => updatePrivacySettings({ performanceMetrics })}
          label="Performance Metrics"
          description="Share system performance data for optimization"
        />
      </SettingsSection>

      <SettingsSection 
        title="Advertising & Tracking" 
        description="Control advertising and tracking preferences"
        icon="🎯"
      >
        <ToggleSwitch
          enabled={privacy.personalizedAds}
          onChange={(personalizedAds) => updatePrivacySettings({ personalizedAds })}
          label="Personalized Ads"
          description="Show ads tailored to your interests"
        />

        <ToggleSwitch
          enabled={privacy.cookieConsent}
          onChange={(cookieConsent) => updatePrivacySettings({ cookieConsent })}
          label="Cookie Consent"
          description="Allow cookies for enhanced functionality"
        />
      </SettingsSection>

      <SettingsSection 
        title="Privacy Tools" 
        description="Manage your privacy and data"
        icon="🔒"
      >
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
            📄 View Privacy Policy
          </button>
          <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
            📋 Download My Data
          </button>
          <button className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors">
            🧹 Clear Tracking Data
          </button>
          <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
            🗑️ Delete All Personal Data
          </button>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Data Requests" 
        description="Request changes to your data"
        icon="📝"
      >
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-3">
            You have the right to request access, correction, or deletion of your personal data. 
            Use the buttons above or contact our support team for assistance.
          </p>
          <div className="text-xs text-gray-400">
            Last updated: January 2024
          </div>
        </div>
      </SettingsSection>
    </SettingsContainer>
  );
};