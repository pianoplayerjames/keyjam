// client/src/ui/settings/ControlsSettings.tsx
import React, { useState } from 'react';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { SettingsSection } from '../../shared/components/settings/SettingsSection';
import { ToggleSwitch } from '../../shared/components/settings/ToggleSwitch';
import { Slider } from '../../shared/components/settings/Slider';
import { SettingsContainer } from '../../shared/components/settings/SettingsContainer';

export const ControlsSettings: React.FC = () => {
  const { controls, updateControlsSettings } = useSettingsStore();
  const [bindingKey, setBindingKey] = useState<string | null>(null);

  const keyBindingLabels = {
    lane1: 'Lane 1',
    lane2: 'Lane 2', 
    lane3: 'Lane 3',
    lane4: 'Lane 4',
    lane5: 'Lane 5',
    pause: 'Pause Game',
    restart: 'Restart'
  };

  const handleKeyBinding = (action: string) => {
    setBindingKey(action);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      const newBindings = { ...controls.keyBindings, [action]: e.key };
      updateControlsSettings({ keyBindings: newBindings });
      setBindingKey(null);
      document.removeEventListener('keydown', handleKeyPress);
    };
    
    document.addEventListener('keydown', handleKeyPress);
  };

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Key Bindings" 
        description="Customize your keyboard controls"
        icon="⌨️"
      >
        {Object.entries(keyBindingLabels).map(([action, label]) => (
          <div key={action} className="flex items-center justify-between py-3">
            <div>
              <div className="text-white font-medium">{label}</div>
            </div>
            <button
              onClick={() => handleKeyBinding(action)}
              className={`px-4 py-2 rounded-lg font-mono text-sm border transition-colors ${
                bindingKey === action
                  ? 'bg-blue-600 text-white border-blue-500 animate-pulse'
                  : 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600'
              }`}
            >
              {bindingKey === action ? 'Press key...' : controls.keyBindings[action]?.toUpperCase() || 'UNBOUND'}
            </button>
          </div>
        ))}
      </SettingsSection>

      <SettingsSection 
        title="Input Settings" 
        description="Fine-tune input responsiveness"
        icon="🎮"
      >
        <Slider
          value={controls.sensitivity}
          onChange={(sensitivity) => updateControlsSettings({ sensitivity })}
          label="Input Sensitivity"
          description="How responsive key presses are"
          min={1}
          max={100}
          unit="%"
        />

        <Slider
          value={controls.doubleClickSpeed}
          onChange={(doubleClickSpeed) => updateControlsSettings({ doubleClickSpeed })}
          label="Double Click Speed"
          description="Maximum time between clicks for double-click"
          min={100}
          max={1000}
          step={50}
          unit="ms"
        />

        <Slider
          value={controls.holdThreshold}
          onChange={(holdThreshold) => updateControlsSettings({ holdThreshold })}
          label="Hold Threshold"
          description="Minimum time to register a hold input"
          min={50}
          max={500}
          step={25}
          unit="ms"
        />
      </SettingsSection>

      <SettingsSection 
        title="Advanced Controls" 
        description="Additional input options"
        icon="🔧"
      >
        <ToggleSwitch
          enabled={controls.gestureControls}
          onChange={(gestureControls) => updateControlsSettings({ gestureControls })}
          label="Gesture Controls"
          description="Enable touch gesture recognition"
        />

        <ToggleSwitch
          enabled={controls.gamepadEnabled}
          onChange={(gamepadEnabled) => updateControlsSettings({ gamepadEnabled })}
          label="Gamepad Support"
          description="Allow gamepad/controller input"
        />

        {controls.gamepadEnabled && (
          <Slider
            value={controls.gamepadDeadzone}
            onChange={(gamepadDeadzone) => updateControlsSettings({ gamepadDeadzone })}
            label="Gamepad Deadzone"
            description="Minimum input threshold for analog sticks"
            min={0}
            max={50}
            unit="%"
          />
        )}
      </SettingsSection>
    </SettingsContainer>
  );
};