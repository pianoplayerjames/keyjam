import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { Slider } from '@/shared/components/settings/Slider';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const InputSettings: React.FC = () => {
  const { input, updateInputSettings } = useSettingsStore();

  const layoutOptions = [
    { value: 'qwerty', label: 'QWERTY', description: 'Standard keyboard layout' },
    { value: 'dvorak', label: 'Dvorak', description: 'Alternative keyboard layout' },
    { value: 'colemak', label: 'Colemak', description: 'Ergonomic keyboard layout' },
  ];

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Keyboard Settings" 
        description="Configure keyboard input and layout"
        icon="⌨️"
      >
        <SelectDropdown
          value={input.keyboardLayout}
          onChange={(keyboardLayout) => updateInputSettings({ keyboardLayout: keyboardLayout as any })}
          options={layoutOptions}
          label="Keyboard Layout"
          description="Your physical keyboard layout"
        />

        <ToggleSwitch
          enabled={input.inputBuffering}
          onChange={(inputBuffering) => updateInputSettings({ inputBuffering })}
          label="Input Buffering"
          description="Buffer inputs to prevent missed notes"
        />

        <ToggleSwitch
          enabled={input.multiKeyInput}
          onChange={(multiKeyInput) => updateInputSettings({ multiKeyInput })}
          label="Multi-Key Input"
          description="Allow multiple simultaneous key presses"
        />

        <ToggleSwitch
         enabled={input.ghostKeyPrevention}
         onChange={(ghostKeyPrevention) => updateInputSettings({ ghostKeyPrevention })}
         label="Ghost Key Prevention"
         description="Prevent phantom key presses"
       />
     </SettingsSection>

     <SettingsSection 
       title="Timing & Calibration" 
       description="Fine-tune input timing"
       icon="⏱️"
     >
       <Slider
         value={input.inputDelay}
         onChange={(inputDelay) => updateInputSettings({ inputDelay })}
         label="Input Delay"
         description="Compensate for input lag"
         min={-100}
         max={100}
         unit="ms"
       />

       <Slider
         value={input.calibrationOffset}
         onChange={(calibrationOffset) => updateInputSettings({ calibrationOffset })}
         label="Calibration Offset"
         description="Global timing adjustment"
         min={-200}
         max={200}
         unit="ms"
       />
     </SettingsSection>

     <SettingsSection 
       title="Calibration Tools" 
       description="Test and adjust your setup"
       icon="🔧"
     >
       <div className="space-y-3">
         <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
           🎵 Audio Calibration Test
         </button>
         <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
           👀 Visual Calibration Test
         </button>
         <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
           ⌨️ Input Latency Test
         </button>
         <button className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
           🔄 Reset All Calibration
         </button>
       </div>
     </SettingsSection>
   </SettingsContainer>
 );
};