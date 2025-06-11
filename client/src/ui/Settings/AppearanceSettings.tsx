// client/src/ui/settings/AppearanceSettings.tsx
import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { Slider } from '@/shared/components/settings/Slider';
import { ColorPicker } from '@/shared/components/settings/ColorPicker';
import { SelectDropdown } from '@/shared/components/settings/SelectDropdown';

export const AppearanceSettings: React.FC = () => {
  const { appearance, updateAppearanceSettings } = useSettingsStore();

  const themeOptions = [
    { value: 'dark', label: 'Dark Theme', description: 'Easy on the eyes' },
    { value: 'light', label: 'Light Theme', description: 'Bright and clean' },
    { value: 'auto', label: 'Auto', description: 'Follows system setting' },
  ];

  const backgroundOptions = [
    { value: 'animated', label: 'Animated', description: 'Dynamic background with particles' },
    { value: 'static', label: 'Static', description: 'Simple gradient background' },
    { value: 'particles', label: 'Particles Only', description: 'Just floating particles' },
    { value: 'minimal', label: 'Minimal', description: 'Solid color background' },
  ];

  const colorSchemeOptions = [
    { value: 'default', label: 'Default', description: 'Pink and purple gradients' },
    { value: 'neon', label: 'Neon', description: 'Bright electric colors' },
    { value: 'pastel', label: 'Pastel', description: 'Soft, muted colors' },
    { value: 'monochrome', label: 'Monochrome', description: 'Black and white' },
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact text' },
    { value: 'medium', label: 'Medium', description: 'Standard size' },
    { value: 'large', label: 'Large', description: 'Easier to read' },
  ];

  return (
    <div className="p-6 max-h-full overflow-y-auto">
      <SettingsSection 
        title="Theme & Colors" 
        description="Customize the overall look and feel"
        icon="🎨"
      >
        <SelectDropdown
          value={appearance.theme}
          onChange={(theme) => updateAppearanceSettings({ theme: theme as any })}
          options={themeOptions}
          label="Theme"
          description="Choose your preferred color scheme"
        />
        
        <SelectDropdown
          value={appearance.colorScheme}
          onChange={(colorScheme) => updateAppearanceSettings({ colorScheme: colorScheme as any })}
          options={colorSchemeOptions}
          label="Color Scheme"
          description="Accent colors for UI elements"
        />

        <SelectDropdown
          value={appearance.fontSize}
          onChange={(fontSize) => updateAppearanceSettings({ fontSize: fontSize as any })}
          options={fontSizeOptions}
          label="Font Size"
          description="Text size throughout the interface"
        />
      </SettingsSection>

      <SettingsSection 
        title="Background & Effects" 
        description="Control visual effects and background animations"
        icon="🌈"
      >
        <SelectDropdown
          value={appearance.backgroundType}
          onChange={(backgroundType) => updateAppearanceSettings({ backgroundType: backgroundType as any })}
          options={backgroundOptions}
          label="Background Type"
          description="Choose the style of background animation"
        />

        <Slider
          value={appearance.backgroundIntensity}
          onChange={(backgroundIntensity) => updateAppearanceSettings({ backgroundIntensity })}
          label="Background Intensity"
          description="How prominent the background effects are"
          min={0}
          max={100}
          unit="%"
        />

        <Slider
          value={appearance.particleCount}
          onChange={(particleCount) => updateAppearanceSettings({ particleCount })}
          label="Particle Count"
          description="Number of particles in background animations"
          min={50}
          max={500}
          step={10}
        />

        <Slider
          value={appearance.animationSpeed}
          onChange={(animationSpeed) => updateAppearanceSettings({ animationSpeed })}
          label="Animation Speed"
          description="Speed of background animations"
          min={10}
          max={200}
          unit="%"
        />

        <Slider
          value={appearance.uiTransparency}
          onChange={(uiTransparency) => updateAppearanceSettings({ uiTransparency })}
          label="UI Transparency"
          description="How transparent interface elements are"
          min={50}
          max={100}
          unit="%"
        />
      </SettingsSection>

      <SettingsSection 
        title="Mouse Trail" 
        description="Customize the mouse cursor trail effect"
        icon="🖱️"
      >
        <ToggleSwitch
          enabled={appearance.mouseTrailEnabled}
          onChange={(mouseTrailEnabled) => updateAppearanceSettings({ mouseTrailEnabled })}
          label="Enable Mouse Trail"
          description="Show a colorful trail following your cursor"
        />

        {appearance.mouseTrailEnabled && (
          <>
            <ColorPicker
              value={appearance.mouseTrailColor}
              onChange={(mouseTrailColor) => updateAppearanceSettings({ mouseTrailColor })}
              label="Trail Color"
              description="Color of the mouse trail effect"
            />

            <Slider
              value={appearance.mouseTrailSize}
              onChange={(mouseTrailSize) => updateAppearanceSettings({ mouseTrailSize })}
              label="Trail Size"
              description="Thickness of the trail lines"
              min={10}
              max={100}
              unit="px"
            />

            <Slider
              value={appearance.mouseTrailLength}
              onChange={(mouseTrailLength) => updateAppearanceSettings({ mouseTrailLength })}
              label="Trail Length"
              description="How long the trail persists"
              min={50}
              max={300}
              step={10}
            />
          </>
        )}
      </SettingsSection>

      <SettingsSection 
        title="Accessibility" 
        description="Options to improve accessibility"
        icon="♿"
      >
        <ToggleSwitch
          enabled={appearance.reducedMotion}
          onChange={(reducedMotion) => updateAppearanceSettings({ reducedMotion })}
          label="Reduce Motion"
          description="Minimize animations for motion sensitivity"
        />
      </SettingsSection>
    </div>
  );
};