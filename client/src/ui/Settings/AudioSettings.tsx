// client/src/ui/settings/AudioSettings.tsx
import React from 'react';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { SettingsSection } from '../../shared/components/settings/SettingsSection';
import { ToggleSwitch } from '../../shared/components/settings/ToggleSwitch';
import { Slider } from '../../shared/components/settings/Slider';
import { SettingsContainer } from '../../shared/components/settings/SettingsContainer';

export const AudioSettings: React.FC = () => {
  const { audio, updateAudioSettings } = useSettingsStore();

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Volume Controls" 
        description="Adjust volume levels for different audio elements"
        icon="🔊"
      >
        <Slider
          value={audio.masterVolume}
          onChange={(masterVolume) => updateAudioSettings({ masterVolume })}
          label="Master Volume"
          description="Overall game volume"
          min={0}
          max={100}
          unit="%"
        />
        
        <Slider
          value={audio.musicVolume}
          onChange={(musicVolume) => updateAudioSettings({ musicVolume })}
          label="Music Volume"
          description="Background music and songs"
          min={0}
          max={100}
          unit="%"
        />
        
        <Slider
          value={audio.effectsVolume}
          onChange={(effectsVolume) => updateAudioSettings({ effectsVolume })}
          label="Sound Effects"
          description="Hit sounds, UI sounds, and game effects"
          min={0}
          max={100}
          unit="%"
        />
      </SettingsSection>

      <SettingsSection 
        title="Audio Features" 
        description="Enable or disable specific audio elements"
        icon="🎵"
      >
        <ToggleSwitch
          enabled={audio.hitSounds}
          onChange={(hitSounds) => updateAudioSettings({ hitSounds })}
          label="Hit Sounds"
          description="Play sound when hitting notes correctly"
        />

        <ToggleSwitch
          enabled={audio.backgroundMusic}
          onChange={(backgroundMusic) => updateAudioSettings({ backgroundMusic })}
          label="Background Music"
          description="Play background music in menus"
        />

        <ToggleSwitch
          enabled={audio.metronome}
          onChange={(metronome) => updateAudioSettings({ metronome })}
          label="Metronome"
          description="Audible beat indicator during gameplay"
        />

        <ToggleSwitch
          enabled={audio.keyboardSounds}
          onChange={(keyboardSounds) => updateAudioSettings({ keyboardSounds })}
          label="Keyboard Sounds"
          description="Sound feedback for key presses"
        />

        <ToggleSwitch
          enabled={audio.uiSounds}
          onChange={(uiSounds) => updateAudioSettings({ uiSounds })}
          label="UI Sounds"
          description="Menu navigation and button sounds"
        />
      </SettingsSection>
    </SettingsContainer>
  );
};