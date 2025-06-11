import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const GameplaySettings: React.FC = () => {
  const { gameplay, updateGameplaySettings } = useSettingsStore();

  const timingOptions = [
    { value: 'strict', label: 'Strict', description: 'Tight timing windows for experts' },
    { value: 'normal', label: 'Normal', description: 'Balanced timing for most players' },
    { value: 'relaxed', label: 'Relaxed', description: 'Forgiving timing for beginners' },
  ];

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Difficulty & Timing" 
        description="Adjust gameplay difficulty and timing"
        icon="🎯"
      >
        <SelectDropdown
          value={gameplay.timingWindow}
          onChange={(timingWindow) => updateGameplaySettings({ timingWindow: timingWindow as any })}
          options={timingOptions}
          label="Timing Window"
          description="How precise your timing needs to be"
        />

        <ToggleSwitch
          enabled={gameplay.visualFeedback}
          onChange={(visualFeedback) => updateGameplaySettings({ visualFeedback })}
          label="Visual Feedback"
          description="Show hit accuracy and timing feedback"
        />

        <ToggleSwitch
          enabled={gameplay.pauseOnFocusLoss}
          onChange={(pauseOnFocusLoss) => updateGameplaySettings({ pauseOnFocusLoss })}
          label="Pause on Focus Loss"
          description="Auto-pause when window loses focus"
        />

        <ToggleSwitch
          enabled={gameplay.autoRetry}
          onChange={(autoRetry) => updateGameplaySettings({ autoRetry })}
          label="Auto Retry"
          description="Automatically restart failed songs"
        />

        <ToggleSwitch
          enabled={gameplay.skipIntros}
          onChange={(skipIntros) => updateGameplaySettings({ skipIntros })}
          label="Skip Intros"
          description="Skip song intros and go straight to gameplay"
        />
      </SettingsSection>

      <SettingsSection 
        title="HUD & Interface" 
        description="Customize the gameplay interface"
        icon="📱"
      >
        <ToggleSwitch
          enabled={gameplay.scoreDisplay}
          onChange={(scoreDisplay) => updateGameplaySettings({ scoreDisplay })}
          label="Score Display"
          description="Show current score during gameplay"
        />

        <ToggleSwitch
          enabled={gameplay.comboCounter}
          onChange={(comboCounter) => updateGameplaySettings({ comboCounter })}
          label="Combo Counter"
          description="Display current hit combo"
        />

        <ToggleSwitch
          enabled={gameplay.accuracyMeter}
          onChange={(accuracyMeter) => updateGameplaySettings({ accuracyMeter })}
          label="Accuracy Meter"
          description="Show real-time accuracy percentage"
        />

        <ToggleSwitch
          enabled={gameplay.showFPS}
          onChange={(showFPS) => updateGameplaySettings({ showFPS })}
          label="Show FPS"
          description="Display frame rate counter"
        />
      </SettingsSection>

      <SettingsSection 
        title="Developer Options" 
        description="Advanced debugging and testing features"
        icon="🔧"
      >
        <ToggleSwitch
          enabled={gameplay.debugMode}
          onChange={(debugMode) => updateGameplaySettings({ debugMode })}
          label="Debug Mode"
          description="Show detailed timing and performance information"
        />
      </SettingsSection>
    </SettingsContainer>
  );
};