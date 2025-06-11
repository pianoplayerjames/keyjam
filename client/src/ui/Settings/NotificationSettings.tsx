import React from 'react';
import { useSettingsStore } from '@/shared/stores/settingsStore';
import { SettingsSection } from '@/shared/components/settings/SettingsSection';
import { ToggleSwitch } from '@/shared/components/settings/ToggleSwitch';
import { Slider } from '@/shared/components/settings/Slider';
import { SettingsContainer } from '@/shared/components/settings/SettingsContainer';

export const NotificationSettings: React.FC = () => {
  const { notifications, updateNotificationSettings } = useSettingsStore();

  return (
    <SettingsContainer>
      <SettingsSection 
        title="In-Game Notifications" 
        description="Control notifications during gameplay"
        icon="🔔"
      >
        <ToggleSwitch
          enabled={notifications.gameNotifications}
          onChange={(gameNotifications) => updateNotificationSettings({ gameNotifications })}
          label="Game Notifications"
          description="Show achievement and score notifications"
        />

        <ToggleSwitch
          enabled={notifications.friendNotifications}
          onChange={(friendNotifications) => updateNotificationSettings({ friendNotifications })}
          label="Friend Notifications"
          description="Alert when friends come online or send messages"
        />

        <ToggleSwitch
          enabled={notifications.achievementNotifications}
          onChange={(achievementNotifications) => updateNotificationSettings({ achievementNotifications })}
          label="Achievement Notifications"
          description="Show when you unlock achievements"
        />

        <ToggleSwitch
          enabled={notifications.tournamentNotifications}
          onChange={(tournamentNotifications) => updateNotificationSettings({ tournamentNotifications })}
          label="Tournament Notifications"
          description="Alerts for tournament events and results"
        />

        <ToggleSwitch
          enabled={notifications.systemNotifications}
          onChange={(systemNotifications) => updateNotificationSettings({ systemNotifications })}
          label="System Notifications"
          description="Updates, maintenance, and system messages"
        />
      </SettingsSection>

      <SettingsSection 
        title="Notification Methods" 
        description="How you receive notifications"
        icon="📢"
      >
        <ToggleSwitch
          enabled={notifications.soundNotifications}
          onChange={(soundNotifications) => updateNotificationSettings({ soundNotifications })}
          label="Sound Notifications"
          description="Play sound for notifications"
        />

        <ToggleSwitch
          enabled={notifications.desktopNotifications}
          onChange={(desktopNotifications) => updateNotificationSettings({ desktopNotifications })}
          label="Desktop Notifications"
          description="Show OS-level notifications"
        />

        <ToggleSwitch
          enabled={notifications.emailNotifications}
          onChange={(emailNotifications) => updateNotificationSettings({ emailNotifications })}
          label="Email Notifications"
          description="Send important updates via email"
        />

        {notifications.soundNotifications && (
          <Slider
            value={notifications.notificationVolume}
            onChange={(notificationVolume) => updateNotificationSettings({ notificationVolume })}
            label="Notification Volume"
            description="Volume level for notification sounds"
            min={0}
            max={100}
            unit="%"
          />
        )}
      </SettingsSection>
    </SettingsContainer>
  );
};