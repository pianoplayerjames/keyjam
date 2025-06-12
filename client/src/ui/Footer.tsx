import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CenteredContainer } from '../shared/components/Layout';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    game: [
      { label: 'Download', path: '/download' },
      { label: 'System Requirements', path: '/requirements' },
      { label: 'Release Notes', path: '/updates' },
      { label: 'Beta Program', path: '/beta' }
    ],
    community: [
      { label: 'Discord Server', path: 'https://discord.gg/cv42c32gak', external: true },
      { label: 'Reddit Community', path: 'https://reddit.com/r/KeyJam', external: true },
      { label: 'YouTube Channel', path: 'https://youtube.com/@KeyJamGG', external: true },
      { label: 'Twitter', path: 'https://x.com/KeyJamGG', external: true },
      { label: 'TikTok', path: 'https://tiktok.com/@KeyJamGG', external: true },
      { label: 'Instagram', path: 'https://instagram.com/KeyJamGG', external: true },
      { label: 'Bluesky', path: 'https://bsky.app/profile/keyjam.bsky.social', external: true },
      { label: 'Facebook', path: 'https://facebook.com/KeyJamGG', external: true }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Bug Reports', path: '/bugs' },
      { label: 'Contact Support', path: '/support' },
      { label: 'Feedback', path: '/feedback' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'DMCA', path: '/dmca' }
    ]
  };

  const handleLinkClick = (path: string, external?: boolean) => {
    if (external) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="mt-auto pb-8 bg-slate-900/40 border-t border-slate-700/30 backdrop-blur-sm">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎵</span>
                </div>
                <div>
                  <div className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    KeyJam
                  </div>
                  <div className="text-xs text-gray-400">Rhythm Reimagined</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The ultimate rhythm game experience. Master the beat, climb the ranks, and join millions of players worldwide.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: '💬', label: 'Discord', url: 'https://discord.gg/cv42c32gak' },
                  { icon: '🐦', label: 'Twitter', url: 'https://x.com/KeyJamGG' },
                  { icon: '📺', label: 'YouTube', url: 'https://youtube.com/@KeyJamGG' },
                  { icon: '🤖', label: 'Reddit', url: 'https://reddit.com/r/KeyJam' }
                ].map((social, index) => (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(social.url, true)}
                    className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center transition-colors duration-200 group"
                    title={social.label}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
<h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
               Game
             </h3>
             <ul className="space-y-3">
               {footerLinks.game.map((link, index) => (
                 <li key={index}>
                   <button
                     onClick={() => handleLinkClick(link.path)}
                     className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform transition-transform"
                   >
                     {link.label}
                   </button>
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
               Community
             </h3>
             <ul className="space-y-3">
               {footerLinks.community.map((link, index) => (
                 <li key={index}>
                   <button
                     onClick={() => handleLinkClick(link.path, link.external)}
                     className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform transition-transform flex items-center gap-1"
                   >
                     {link.label}
                     {link.external && (
                       <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     )}
                   </button>
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
               Support
             </h3>
             <ul className="space-y-3">
               {footerLinks.support.map((link, index) => (
                 <li key={index}>
                   <button
                     onClick={() => handleLinkClick(link.path)}
                     className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform transition-transform"
                   >
                     {link.label}
                   </button>
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
               Legal
             </h3>
             <ul className="space-y-3">
               {footerLinks.legal.map((link, index) => (
                 <li key={index}>
                   <button
                     onClick={() => handleLinkClick(link.path)}
                     className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 transform transition-transform"
                   >
                     {link.label}
                   </button>
                 </li>
               ))}
             </ul>
           </div>
         </div>

         <div className="border-t border-slate-700/50 pt-8 mb-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="text-center">
               <div className="text-2xl font-bold text-pink-400 mb-1">2.4M+</div>
               <div className="text-sm text-gray-400">Registered Players</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-purple-400 mb-1">150K+</div>
               <div className="text-sm text-gray-400">Daily Active Users</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-blue-400 mb-1">50M+</div>
               <div className="text-sm text-gray-400">Songs Played</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-green-400 mb-1">1,200+</div>
               <div className="text-sm text-gray-400">Available Tracks</div>
             </div>
           </div>
         </div>

         <div className="border-t border-slate-700/50 pt-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4 text-sm text-gray-400">
               <span>© {currentYear} <button
                 onClick={() => window.open('https://nixi.ltd', '_blank', 'noopener,noreferrer')}
                 className="hover:text-white transition-colors"
               >Nixi Studio</button>. All rights reserved.</span>
               <span className="hidden md:inline">•</span>
               <span className="hidden md:inline">Made with ❤️ for rhythm game lovers</span>
             </div>
             
             <div className="flex items-center gap-4 text-sm text-gray-400">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                 <span>All systems operational</span>
               </div>
               <span>•</span>
               <span>Version 11.8.2</span>
             </div>
           </div>
         </div>
       </div>
     </CenteredContainer>
   </footer>
 );
};