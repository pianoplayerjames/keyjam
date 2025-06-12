import React from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  description: string;
  color: string;
  followers?: string;
}

interface SocialLinksPageProps {
  onBack: () => void;
}

const SocialLinksPage: React.FC<SocialLinksPageProps> = ({ onBack }) => {
  const socialLinks: SocialLink[] = [
    {
      name: 'Discord',
      icon: '💬',
      url: 'https://discord.gg/cv42c32gak',
      description: 'Join our community for real-time chat, tournaments, and updates',
      color: 'from-indigo-600 to-purple-600',
      followers: '89.2k members'
    },
    {
      name: 'YouTube',
      icon: '📺',
      url: 'https://youtube.com/@KeyJamGG',
      description: 'Watch gameplay videos, tutorials, and tournament highlights',
      color: 'from-red-600 to-red-700',
      followers: '234k subscribers'
    },
    {
      name: 'X (Twitter)',
      icon: '🐦',
      url: 'https://x.com/KeyJamGG',
      description: 'Get the latest news, updates, and community highlights',
      color: 'from-gray-800 to-black',
      followers: '156k followers'
    },
    {
      name: 'TikTok',
      icon: '📱',
      url: 'https://tiktok.com/@KeyJamGG',
      description: 'Short-form content, gameplay clips, and rhythm challenges',
      color: 'from-pink-600 to-rose-600',
      followers: '67k followers'
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/KeyJamGG',
      description: 'Behind the scenes content, community art, and announcements',
      color: 'from-purple-600 to-pink-600',
      followers: '98k followers'
    },
    {
      name: 'Reddit',
      icon: '🤖',
      url: 'https://reddit.com/r/KeyJam',
      description: 'Community discussions, feedback, and user-generated content',
      color: 'from-orange-600 to-red-600',
      followers: '45k members'
    },
    {
      name: 'Bluesky',
      icon: '☁️',
      url: 'https://bsky.app/profile/keyjam.bsky.social',
      description: 'Alternative social platform for updates and community interaction',
      color: 'from-blue-500 to-cyan-500',
      followers: '12k followers'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: 'https://facebook.com/KeyJamGG',
      description: 'Official page for news, events, and community updates',
      color: 'from-blue-600 to-blue-800',
      followers: '78k followers'
    },
    {
      name: 'Nixi Studio',
      icon: '🏢',
      url: 'https://nixi.ltd',
      description: 'Visit our studio website for more games and projects',
      color: 'from-slate-600 to-slate-800',
      followers: 'Our developers'
    }
  ];

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="h-full flex-1 min-h-0">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
            >
              <span className="text-2xl group-hover:translate-x-1 transition-transform">←</span>
              <span className="font-semibold text-lg">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Follow KeyJam
              </h1>
              <p className="text-gray-300 text-lg">Stay connected with our community across all platforms</p>
            </div>
            
            <div className="w-24"></div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {socialLinks.map((social, index) => (
                <div
                  key={social.name}
                  className="group bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500/30 cursor-pointer"
                  onClick={() => handleSocialClick(social.url)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {social.name}
                      </h3>
                      {social.followers && (
                        <p className="text-sm text-gray-400 font-medium">
                          {social.followers}
                        </p>
                      )}
                    </div>
                    <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {social.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">
                      {social.url.replace('https://', '').replace('http://', '')}
                    </span>
                    <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${social.color} text-white font-medium text-sm hover:shadow-lg transition-all duration-200 hover:scale-105`}>
                      Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Join Our Growing Community</h2>
              <p className="text-gray-300 text-lg mb-6">
                Connect with over 500,000+ rhythm game enthusiasts worldwide
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">500k+</div>
                  <div className="text-sm text-gray-400">Total Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">50k+</div>
                  <div className="text-sm text-gray-400">Daily Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Community Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-1">9</div>
                  <div className="text-sm text-gray-400">Platforms</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.slice(0, 4).map((social) => (
                  <button
                    key={social.name}
                    onClick={() => handleSocialClick(social.url)}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r ${social.color} text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105`}
                  >
                    <span className="mr-2">{social.icon}</span>
                    Follow on {social.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default SocialLinksPage;