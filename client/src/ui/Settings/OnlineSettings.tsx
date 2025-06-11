// client/src/ui/settings/OnlineSettings.tsx
import React from 'react';
import { useSettingsStore } from '../../shared/stores/settingsStore';
import { SettingsSection } from '../../shared/components/settings/SettingsSection';
import { ToggleSwitch } from '../../shared/components/settings/ToggleSwitch';
import { Slider } from '../../shared/components/settings/Slider';
import { SettingsContainer } from '../../shared/components/settings/SettingsContainer';

export const OnlineSettings: React.FC = () => {
  const { online, updateOnlineSettings } = useSettingsStore();

  return (
    <SettingsContainer>
      <SettingsSection 
        title="Online Presence" 
        description="Control your online visibility and status"
        icon="🌐"
      >
        <ToggleSwitch
          enabled={online.showOnlineStatus}
          onChange={(showOnlineStatus) => updateOnlineSettings({ showOnlineStatus })}
          label="Show Online Status"
          description="Let friends see when you're online"
        />

        <ToggleSwitch
          enabled={online.allowFriendRequests}
          onChange={(allowFriendRequests) => updateOnlineSettings({ allowFriendRequests })}
          label="Allow Friend Requests"
          description="Other players can send you friend requests"
        />

        <ToggleSwitch
          enabled={online.allowPartyInvites}
          onChange={(allowPartyInvites) => updateOnlineSettings({ allowPartyInvites })}
          label="Allow Party Invites"
          description="Friends can invite you to their parties"
        />

        <ToggleSwitch
          enabled={online.showRealTimeStats}
          onChange={(showRealTimeStats) => updateOnlineSettings({ showRealTimeStats })}
          label="Show Real-time Stats"
          description="Display live performance data to spectators"
        />

        <ToggleSwitch
          enabled={online.autoJoinParties}
          onChange={(autoJoinParties) => updateOnlineSettings({ autoJoinParties })}
          label="Auto-join Parties"
          description="Automatically accept party invites from friends"
        />
      </SettingsSection>

      <SettingsSection 
        title="Communication" 
        description="Chat and voice communication settings"
        icon="💬"
      >
        <ToggleSwitch
          enabled={online.chatFiltering}
          onChange={(chatFiltering) => updateOnlineSettings({ chatFiltering })}
          label="Chat Filtering"
          description="Filter inappropriate messages automatically"
        />

        <ToggleSwitch
          enabled={online.voiceChat}
          onChange={(voiceChat) => updateOnlineSettings({ voiceChat })}
          label="Voice Chat"
          description="Enable voice communication in parties"
        />

        {online.voiceChat && (
          <>
            <ToggleSwitch
              enabled={online.pushToTalk}
              onChange={(pushToTalk) => updateOnlineSettings({ pushToTalk })}
              label="Push to Talk"
              description="Hold a key to transmit voice instead of open mic"
            />

            <Slider
              value={online.microphoneVolume}
              onChange={(microphoneVolume) => updateOnlineSettings({ microphoneVolume })}
              label="Microphone Volume"
              description="Your voice transmission volume"
              min={0}
              max={100}
              unit="%"
            />
          </>
        )}
      </SettingsSection>
    </SettingsContainer>
  );
};