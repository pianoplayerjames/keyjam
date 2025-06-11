// client/src/ui/LeftNav.tsx
import React, { useState } from 'react';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { AudioSettings } from './settings/AudioSettings';
import { ControlsSettings } from './settings/ControlsSettings';
import { OnlineSettings } from './settings/OnlineSettings';
import { PerformanceSettings } from './settings/PerformanceSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { GameplaySettings } from './settings/GameplaySettings';
import { AccountSettings } from './settings/AccountSettings';
import { InputSettings } from './settings/InputSettings';
import { LanguageSettings } from './settings/LanguageSettings';
import { PrivacySettings } from './settings/PrivacySettings';
import { DataSettings } from './settings/DataSettings';

const friends = [
  { id: 1, name: 'RhythmGod', avatar: '🤖', status: 'online', messageCount: 2 },
  { id: 2, name: 'BeatMaster', avatar: '🧑', status: 'online', messageCount: 0 },
  { id: 3, name: 'ComboKing', avatar: '🦄', status: 'away', messageCount: 1 },
  { id: 4, name: 'SoundWave', avatar: '🐼', status: 'offline', messageCount: 0 },
  { id: 5, name: 'NoteNinja', avatar: '🦊', status: 'online', messageCount: 5 },
  { id: 6, name: 'MelodyMaster', avatar: '🐙', status: 'in-game', messageCount: 0 },
  { id: 7, name: 'TimingPro', avatar: '🦖', status: 'online', messageCount: 3 },
  { id: 8, name: 'AccuracyAce', avatar: '🤖', status: 'online', messageCount: 0 },
  { id: 9, name: 'BeatBoss', avatar: '🧑', status: 'online', messageCount: 1 },
  { id: 10, name: 'RhythmRuler', avatar: '🦄', status: 'away', messageCount: 0 },
  { id: 11, name: 'SoundSavant', avatar: '🐼', status: 'offline', messageCount: 2 },
  { id: 12, name: 'NoteSavage', avatar: '🦊', status: 'online', messageCount: 0 }
];

const mockNotifications = [
  { id: 1, text: 'New tournament starting in 5 minutes!', type: 'tournament', time: '2m ago', read: false },
  { id: 2, text: 'Friend request from BeatMaster99', type: 'friend', time: '5m ago', read: false },
  { id: 3, text: 'Achievement unlocked: Combo King!', type: 'achievement', time: '1h ago', read: true },
  { id: 4, text: 'Daily challenge completed', type: 'challenge', time: '2h ago', read: true },
  { id: 5, text: 'Server maintenance scheduled for tonight', type: 'system', time: '3h ago', read: false },
  { id: 6, text: 'Weekly leaderboard reset', type: 'system', time: '1d ago', read: true },
  { id: 7, text: 'New friend online: SoundWave', type: 'friend', time: '2d ago', read: true },
  { id: 8, text: 'High score beaten in Neon Dreams!', type: 'achievement', time: '3d ago', read: true },
];

const mockMessages: { [key: number]: Array<{ id: number; text: string; sender: 'me' | 'them'; timestamp: string; }> } = {
  1: [
    { id: 1, text: 'Hey! Want to play some co-op?', sender: 'them', timestamp: '2:30 PM' },
    { id: 2, text: 'Sure! Which song?', sender: 'me', timestamp: '2:32 PM' },
    { id: 3, text: 'How about Neon Dreams on Expert?', sender: 'them', timestamp: '2:33 PM' },
    { id: 4, text: 'Perfect! Creating room now', sender: 'me', timestamp: '2:34 PM' },
  ],
  3: [
    { id: 1, text: 'Nice combo streak in the tournament!', sender: 'them', timestamp: '1:45 PM' },
  ],
  5: [
    { id: 1, text: 'Did you see the new update?', sender: 'them', timestamp: '12:20 PM' },
    { id: 2, text: 'Yeah! The new songs are amazing', sender: 'me', timestamp: '12:22 PM' },
    { id: 3, text: 'Especially that techno track', sender: 'them', timestamp: '12:23 PM' },
    { id: 4, text: 'Want to practice it together?', sender: 'them', timestamp: '12:24 PM' },
    { id: 5, text: 'Lets do it after my current match', sender: 'me', timestamp: '12:25 PM' },
  ],
  7: [
    { id: 1, text: 'Your timing on that last song was perfect!', sender: 'them', timestamp: '11:30 AM' },
    { id: 2, text: 'Thanks! Been practicing a lot', sender: 'me', timestamp: '11:32 AM' },
    { id: 3, text: 'Any tips for the fast sections?', sender: 'them', timestamp: '11:33 PM' },
  ],
  9: [
    { id: 1, text: 'GG on that match!', sender: 'them', timestamp: '10:15 AM' },
  ],
  11: [
    { id: 1, text: 'When will you be online next?', sender: 'them', timestamp: 'Yesterday' },
    { id: 2, text: 'Miss our daily challenges!', sender: 'them', timestamp: 'Yesterday' },
  ],
};

const settingsPages = [
  { id: 'audio', icon: '🎵', title: 'Audio Settings', desc: 'Volume, sound effects, music', component: AudioSettings },
  { id: 'appearance', icon: '🎨', title: 'Appearance', desc: 'Theme, colors, animations', component: AppearanceSettings },
  { id: 'controls', icon: '⌨️', title: 'Controls', desc: 'Key bindings, input settings', component: ControlsSettings },
  { id: 'online', icon: '🌐', title: 'Online', desc: 'Privacy, friends, multiplayer', component: OnlineSettings },
  { id: 'performance', icon: '📊', title: 'Performance', desc: 'Graphics, FPS, optimization', component: PerformanceSettings },
  { id: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Alerts, sounds, badges', component: NotificationSettings },
  { id: 'gameplay', icon: '🎯', title: 'Gameplay', desc: 'Difficulty, scoring, timing', component: GameplaySettings },
  { id: 'account', icon: '📱', title: 'Account', desc: 'Profile, achievements, stats', component: AccountSettings },
  { id: 'input', icon: '🎮', title: 'Input Devices', desc: 'Keyboard, gamepad, calibration', component: InputSettings },
  { id: 'language', icon: '🌍', title: 'Language', desc: 'Region, localization, time zone', component: LanguageSettings },
  { id: 'privacy', icon: '🔐', title: 'Privacy', desc: 'Data sharing, analytics, cookies', component: PrivacySettings },
  { id: 'data', icon: '💾', title: 'Data & Storage', desc: 'Save files, cloud sync, backups', component: DataSettings },
];

const getStatusColor = (status: 'online' | 'away' | 'in-game' | 'offline') => {
  switch (status) {
    case 'online': return 'bg-green-400';
    case 'away': return 'bg-yellow-400';
    case 'in-game': return 'bg-blue-400';
    default: return 'bg-gray-500';
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'tournament': return '🏆';
    case 'friend': return '👥';
    case 'achievement': return '🎯';
    case 'challenge': return '⚡';
    case 'system': return '⚙️';
    default: return '🔔';
  }
};

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold border-2 border-slate-900 z-10">
      {count > 99 ? '99+' : count}
    </div>
  );
};

const MessageBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <div className="absolute -bottom-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold border-2 border-slate-900 z-10">
      {count > 9 ? '9+' : count}
    </div>
  );
};

const SettingsPageRenderer: React.FC<{ page: string; onBack: () => void }> = ({ page, onBack }) => {
  const settingsPage = settingsPages.find(p => p.id === page);
  if (!settingsPage) return null;
  
  const SettingsComponent = settingsPage.component;
  
  return (
    <>
      <style>
        {`
          .leftnav-scrollbar::-webkit-scrollbar {
            width: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          
          .leftnav-scrollbar:hover::-webkit-scrollbar {
            opacity: 1;
          }
          
          .leftnav-scrollbar::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 4px;
          }
          
          .leftnav-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.5);
            border-radius: 4px;
            border: 1px solid rgba(30, 41, 59, 0.8);
          }
          
          .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.8);
          }

          .leftnav-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.2s ease;
          }

          .leftnav-scrollbar:hover {
            scrollbar-color: rgba(148, 163, 184, 0.5) rgba(51, 65, 85, 0.3);
          }
        `}
      </style>
      <nav className="fixed top-0 left-0 h-screen w-96 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden z-50">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="font-semibold">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{settingsPage.icon}</span>
                <h2 className="text-white font-bold text-lg">{settingsPage.title}</h2>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto leftnav-scrollbar">
            <SettingsComponent />
          </div>
        </div>
      </nav>
    </>
  );
};

const LeftNav = () => {
  const [activeSection, setActiveSection] = useState<'main' | 'notifications' | 'settings' | 'chat' | 'search'>('main');
  const [activeChatFriend, setActiveChatFriend] = useState<number | null>(null);
  const [activeSettingsPage, setActiveSettingsPage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  const totalMessages = friends.reduce((sum, friend) => sum + friend.messageCount, 0);

  const handleNotificationsClick = () => {
    setActiveSection(activeSection === 'notifications' ? 'main' : 'notifications');
  };

  const handleSettingsClick = () => {
    setActiveSection(activeSection === 'settings' ? 'main' : 'settings');
    setActiveSettingsPage(null);
  };

  const handleSearchClick = () => {
    setActiveSection(activeSection === 'search' ? 'main' : 'search');
    if (activeSection !== 'search') {
      setSearchQuery('');
    }
  };

  const handleFriendClick = (friendId: number) => {
    setActiveChatFriend(friendId);
    setActiveSection('chat');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChatFriend) return;
    
    const newMsg = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChatFriend]: [...(prev[activeChatFriend] || []), newMsg]
    }));
    
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markNotificationAsRead = (id: number) => {
    console.log(`Marking notification ${id} as read`);
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotifications = mockNotifications.filter(notification =>
    notification.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show settings page if one is selected
  if (activeSection === 'settings' && activeSettingsPage) {
    return <SettingsPageRenderer page={activeSettingsPage} onBack={() => setActiveSettingsPage(null)} />;
  }

  if (activeSection === 'search') {
    return (
      <>
        <style>
          {`
            .leftnav-scrollbar::-webkit-scrollbar {
              width: 8px;
              opacity: 0;
              transition: opacity 0.2s ease;
            }
            
            .leftnav-scrollbar:hover::-webkit-scrollbar {
              opacity: 1;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-track {
              background: rgba(51, 65, 85, 0.3);
              border-radius: 4px;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 4px;
              border: 1px solid rgba(30, 41, 59, 0.8);
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.8);
            }

            .leftnav-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
              transition: scrollbar-color 0.2s ease;
            }

            .leftnav-scrollbar:hover {
              scrollbar-color: rgba(148, 163, 184, 0.5) rgba(51, 65, 85, 0.3);
            }
          `}
        </style>
        <nav className="fixed top-0 left-0 h-screen w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden z-50">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setActiveSection('main')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-xl">←</span>
                  <span className="font-semibold">Back</span>
                </button>
                <h2 className="text-white font-bold text-lg">Search</h2>
                <div className="w-16"></div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search friends, messages, notifications..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  autoFocus
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto leftnav-scrollbar p-2">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="text-sm">Start typing to search...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFriends.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 px-2">Friends</h3>
                      {filteredFriends.map(friend => (
                        <button
                          key={friend.id}
                          onClick={() => handleFriendClick(friend.id)}
                          className="flex items-center w-full p-3 mb-1 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/50 transition-colors group"
                        >
                          <div className="relative">
                            <span className="text-2xl">{friend.avatar}</span>
                            <div className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-slate-900 ${getStatusColor(friend.status)}`}></div>
                            <MessageBadge count={friend.messageCount} />
                          </div>
                          <div className="ml-3 flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                {friend.name}
                              </span>
                              {friend.messageCount > 0 && (
                                <div className="ml-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                                  {friend.messageCount > 9 ? '9+' : friend.messageCount}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {friend.status === 'in-game' ? 'Playing KeyJam' : friend.status}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredNotifications.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 text-xs font-bold uppercase mb-2 px-2">Notifications</h3>
                      {filteredNotifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                            notification.read 
                              ? 'bg-slate-800/30 text-gray-400' 
                              : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-200'}`}>
                                {notification.text}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {notification.time}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredFriends.length === 0 && filteredNotifications.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <span className="text-4xl block mb-2">😔</span>
                      <p className="text-sm">No results found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {searchQuery.trim() !== '' && (
              <div className="p-4 border-t border-slate-700/50">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </nav>
      </>
    );
  }

  if (activeSection === 'chat' && activeChatFriend) {
    const friend = friends.find(f => f.id === activeChatFriend);
    const chatMessages = messages[activeChatFriend] || [];
    
    return (
      <>
        <style>
          {`
            .leftnav-scrollbar::-webkit-scrollbar {
              width: 8px;
              opacity: 0;
              transition: opacity 0.2s ease;
            }
            
            .leftnav-scrollbar:hover::-webkit-scrollbar {
              opacity: 1;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-track {
              background: rgba(51, 65, 85, 0.3);
              border-radius: 4px;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 4px;
              border: 1px solid rgba(30, 41, 59, 0.8);
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.8);
            }

            .leftnav-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
              transition: scrollbar-color 0.2s ease;
            }

            .leftnav-scrollbar:hover {
              scrollbar-color: rgba(148, 163, 184, 0.5) rgba(51, 65, 85, 0.3);
            }
          `}
        </style>
        <nav className="fixed top-0 left-0 h-screen w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden z-50">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveSection('main')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-xl">←</span>
                  <span className="font-semibold">Back</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{friend?.avatar}</span>
                  <div>
                    <h2 className="text-white font-bold text-sm">{friend?.name}</h2>
                    <p className="text-xs text-gray-400 capitalize">{friend?.status}</p>
                  </div>
                </div>
                <div className="w-16"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto leftnav-scrollbar p-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  if (activeSection === 'notifications') {
    return (
      <>
        <style>
          {`
            .leftnav-scrollbar::-webkit-scrollbar {
              width: 8px;
              opacity: 0;
              transition: opacity 0.2s ease;
            }
            
            .leftnav-scrollbar:hover::-webkit-scrollbar {
              opacity: 1;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-track {
              background: rgba(51, 65, 85, 0.3);
              border-radius: 4px;
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 4px;
              border: 1px solid rgba(30, 41, 59, 0.8);
            }
            
            .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.8);
            }

            .leftnav-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
              transition: scrollbar-color 0.2s ease;
            }

            .leftnav-scrollbar:hover {
              scrollbar-color: rgba(148, 163, 184, 0.5) rgba(51, 65, 85, 0.3);
            }
          `}
        </style>
        <nav className="fixed top-0 left-0 h-screen w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden z-50">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveSection('main')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-xl">←</span>
                  <span className="font-semibold">Back</span>
                </button>
<h2 className="text-white font-bold text-lg">Notifications</h2>
               <div className="w-16"></div>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto leftnav-scrollbar p-2">
             {mockNotifications.map((notification) => (
               <div
                 key={notification.id}
                 onClick={() => markNotificationAsRead(notification.id)}
                 className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                   notification.read 
                     ? 'bg-slate-800/30 text-gray-400' 
                     : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                 }`}
               >
                 <div className="flex items-start gap-3">
                   <span className="text-lg flex-shrink-0 mt-0.5">
                     {getNotificationIcon(notification.type)}
                   </span>
                   <div className="flex-1 min-w-0">
                     <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-400' : 'text-gray-200'}`}>
                       {notification.text}
                     </p>
                     <span className="text-xs text-gray-500 mt-1 block">
                       {notification.time}
                     </span>
                   </div>
                   {!notification.read && (
                     <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                   )}
                 </div>
               </div>
             ))}
           </div>

           <div className="p-4 border-t border-slate-700/50">
             <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
               Mark All as Read
             </button>
           </div>
         </div>
       </nav>
     </>
   );
 }

 if (activeSection === 'settings') {
   return (
     <>
       <style>
         {`
           .leftnav-scrollbar::-webkit-scrollbar {
             width: 8px;
             opacity: 0;
             transition: opacity 0.2s ease;
           }
           
           .leftnav-scrollbar:hover::-webkit-scrollbar {
             opacity: 1;
           }
           
           .leftnav-scrollbar::-webkit-scrollbar-track {
             background: rgba(51, 65, 85, 0.3);
             border-radius: 4px;
           }
           
           .leftnav-scrollbar::-webkit-scrollbar-thumb {
             background: rgba(148, 163, 184, 0.5);
             border-radius: 4px;
             border: 1px solid rgba(30, 41, 59, 0.8);
           }
           
           .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
             background: rgba(148, 163, 184, 0.8);
           }

           .leftnav-scrollbar {
             scrollbar-width: thin;
             scrollbar-color: transparent transparent;
             transition: scrollbar-color 0.2s ease;
           }

           .leftnav-scrollbar:hover {
             scrollbar-color: rgba(148, 163, 184, 0.5) rgba(51, 65, 85, 0.3);
           }
         `}
       </style>
       <nav className="fixed top-0 left-0 h-screen w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden z-50">
         <div className="flex flex-col h-full">
           <div className="p-4 border-b border-slate-700/50">
             <div className="flex items-center justify-between">
               <button
                 onClick={() => setActiveSection('main')}
                 className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
               >
                 <span className="text-xl">←</span>
                 <span className="font-semibold">Back</span>
               </button>
               <h2 className="text-white font-bold text-lg">Settings</h2>
               <div className="w-16"></div>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto leftnav-scrollbar p-2">
             {settingsPages.map((setting) => (
               <div
                 key={setting.id}
                 onClick={() => setActiveSettingsPage(setting.id)}
                 className="p-3 mb-2 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/50 transition-colors group"
               >
                 <div className="flex items-center gap-3">
                   <span className="text-xl">{setting.icon}</span>
                   <div className="flex-1">
                     <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                       {setting.title}
                     </h3>
                     <p className="text-xs text-gray-400">{setting.desc}</p>
                   </div>
                   <span className="text-gray-500 group-hover:text-gray-300 transition-colors">
                     →
                   </span>
                 </div>
               </div>
             ))}
           </div>

           <div className="p-4 border-t border-slate-700/50">
             <div className="text-center text-xs text-gray-500">
               KeyJam v11.8.2
             </div>
           </div>
         </div>
       </nav>
     </>
   );
 }

 return (
   <>
     <style>
       {`
         .leftnav-scrollbar::-webkit-scrollbar {
           width: 6px;
           opacity: 0;
           transition: opacity 0.2s ease;
         }
         
         .leftnav-scrollbar:hover::-webkit-scrollbar {
           opacity: 1;
         }
         
         .leftnav-scrollbar::-webkit-scrollbar-track {
           background: rgba(51, 65, 85, 0.2);
           border-radius: 3px;
         }
         
         .leftnav-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(148, 163, 184, 0.4);
           border-radius: 3px;
           border: 1px solid rgba(30, 41, 59, 0.6);
         }
         
         .leftnav-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(148, 163, 184, 0.7);
         }

         .leftnav-scrollbar {
           scrollbar-width: thin;
           scrollbar-color: transparent transparent;
           transition: scrollbar-color 0.2s ease;
         }

         .leftnav-scrollbar:hover {
           scrollbar-color: rgba(148, 163, 184, 0.4) rgba(51, 65, 85, 0.2);
         }

         .leftnav-main-container:hover .leftnav-scrollbar::-webkit-scrollbar {
           opacity: 1;
         }

         .leftnav-main-container:hover .leftnav-scrollbar {
           scrollbar-color: rgba(148, 163, 184, 0.4) rgba(51, 65, 85, 0.2);
         }
       `}
     </style>
     <nav className="leftnav-main-container fixed top-0 left-0 h-screen w-18 hover:w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-x-hidden z-50 group">
       <div className="flex flex-col justify-between h-full">
         <ul className="flex flex-col items-start mt-2 space-y-0">
           <li className="w-full">
             <button
               onClick={handleSearchClick}
               className="flex items-center w-full p-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200"
             >
               <span className="text-3xl">🔍</span>
               <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">
                 Search
               </span>
             </button>
           </li>
           <li className="w-full">
             <button
               onClick={handleNotificationsClick}
               className="flex items-center w-full p-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 relative"
             >
               <div className="relative">
                 <span className="text-3xl">🔔</span>
                 <NotificationBadge count={unreadNotifications} />
               </div>
               <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">
                 Notifications
               </span>
             </button>
           </li>
           <li className="w-full">
             <button
               onClick={handleSettingsClick}
               className="flex items-center w-full p-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200"
             >
               <span className="text-3xl">⚙️</span>
               <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">
                 Settings
               </span>
             </button>
           </li>
         </ul>

         <div className="flex-1 flex flex-col min-h-0">
           <div className="px-4 py-2 border-b border-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
             <div className="flex items-center justify-between">
               <span className="text-gray-500 text-xs font-bold uppercase">Direct Messages</span>
               {totalMessages > 0 && (
                 <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                   {totalMessages}
                 </span>
               )}
             </div>
           </div>

           <ul className="flex-1 overflow-y-auto leftnav-scrollbar min-h-0">
             {friends.map(friend => (
               <li key={friend.id} className="w-full">
                 <button 
                   onClick={() => handleFriendClick(friend.id)}
                   className="flex items-center w-full p-4 py-3 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 group/friend"
                 >
                   <div className="relative">
                     <span className="text-3xl">{friend.avatar}</span>
                     <div className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-slate-900 ${getStatusColor(friend.status)}`}></div>
                     <MessageBadge count={friend.messageCount} />
                   </div>
                   <div className="ml-4 flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                     <div className="flex items-center justify-between">
                       <span className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                         {friend.name}
                       </span>
                       {friend.messageCount > 0 && (
                         <div className="ml-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
                           {friend.messageCount > 9 ? '9+' : friend.messageCount}
                         </div>
                       )}
                     </div>
                     <div className="text-xs text-gray-500 capitalize text-left">
                       {friend.status === 'in-game' ? 'Playing KeyJam' : friend.status}
                     </div>
                   </div>
                 </button>
               </li>
             ))}
           </ul>
         </div>
       </div>
     </nav>
   </>
 );
};

export default LeftNav;