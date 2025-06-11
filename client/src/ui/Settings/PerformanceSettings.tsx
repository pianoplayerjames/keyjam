import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const PerformanceSettings: React.FC = () => {
  const { performance, updatePerformanceSettings } = useSettingsStore();

  const fpsOptions = [
    { value: '60', label: '60 FPS', description: 'Standard refresh rate' },
    { value: '120', label: '120 FPS', description: 'High refresh rate' },
    { value: '144', label: '144 FPS', description: 'Gaming monitor standard' },
    { value: '240', label: '240 FPS', description: 'Competitive gaming' },
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low', description: 'Best performance' },
    { value: 'medium', label: 'Medium', description: 'Balanced' },
    { value: 'high', label: 'High', description: 'Best quality' },
  ];

  const shadowOptions = [
    { value: 'off', label: 'Off', description: 'No shadows' },
    ...qualityOptions
  ];

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Display Performance" 
        description="Graphics and rendering settings"
        icon="📊"
      >
        <SelectDropdown
          value={performance.targetFPS.toString()}
          onChange={(targetFPS) => updatePerformanceSettings({ targetFPS: Number(targetFPS) as any })}
          options={fpsOptions}
          label="Target Frame Rate"
          description="Maximum frames per second to render"
        />

        <ToggleSwitch
          enabled={performance.vsync}
          onChange={(vsync) => updatePerformanceSettings({ vsync })}
          label="V-Sync"
          description="Synchronize frame rate with monitor refresh"
        />

        <ToggleSwitch
          enabled={performance.hardwareAcceleration}
          onChange={(hardwareAcceleration) => updatePerformanceSettings({ hardwareAcceleration })}
          label="Hardware Acceleration"
          description="Use GPU for better performance"
        />
      </SettingsSection>

      <SettingsSection 
        title="Visual Quality" 
        description="Adjust graphics quality settings"
        icon="🎨"
      >
        <ToggleSwitch
          enabled={performance.antiAliasing}
          onChange={(antiAliasing) => updatePerformanceSettings({ antiAliasing })}
          label="Anti-Aliasing"
          description="Smooth jagged edges (may impact performance)"
        />

        <SelectDropdown
          value={performance.particleQuality}
          onChange={(particleQuality) => updatePerformanceSettings({ particleQuality: particleQuality as any })}
          options={qualityOptions}
          label="Particle Quality"
          description="Visual effects particle detail level"
        />

        <SelectDropdown
          value={performance.shadowQuality}
          onChange={(shadowQuality) => updatePerformanceSettings({ shadowQuality: shadowQuality as any })}
          options={shadowOptions}
          label="Shadow Quality"
          description="Shadow rendering detail level"
        />

        <SelectDropdown
          value={performance.textureQuality}
          onChange={(textureQuality) => updatePerformanceSettings({ textureQuality: textureQuality as any })}
          options={qualityOptions}
          label="Texture Quality"
          description="Image and surface detail level"
        />

        <ToggleSwitch
          enabled={performance.backgroundAnimations}
          onChange={(backgroundAnimations) => updatePerformanceSettings({ backgroundAnimations })}
          label="Background Animations"
          description="Animated backgrounds and effects"
        />
      </SettingsSection>
    </SettingsContainer>
  );
};