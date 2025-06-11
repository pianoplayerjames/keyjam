import React, { useState, useMemo } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface User {
  id: string;
  username: string;
  avatar: string;
  elo: number;
  rank: string;
  joinDate: Date;
  totalPosts: number;
  totalLikes: number;
  isOnline: boolean;
  badges: UserBadge[];
  forumLevel: number;
  forumXP: number;
  title?: string;
}

interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  category: ForumCategory;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isTrending: boolean;
  createdAt: Date;
  lastActivity: Date;
  lastReply?: {
    author: User;
    createdAt: Date;
  };
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  isOfficial?: boolean;
}

const categories: ForumCategory[] = [
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official game updates and news',
    icon: '📢',
    color: 'from-blue-500 to-blue-600',
    postCount: 24,
    isOfficial: true
  },
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Chat about anything KeyJam related',
    icon: '💬',
    color: 'from-green-500 to-green-600',
    postCount: 1247
  },
  {
    id: 'strategy',
    name: 'Strategy & Tips',
    description: 'Share your techniques and get advice',
    icon: '🎯',
    color: 'from-purple-500 to-purple-600',
    postCount: 892
  },
  {
    id: 'tournaments',
    name: 'Tournaments',
    description: 'Competitive events and esports',
    icon: '🏆',
    color: 'from-yellow-500 to-orange-500',
    postCount: 456
  },
  {
    id: 'technical',
    name: 'Technical Help',
    description: 'Get help with bugs and technical issues',
    icon: '🔧',
    color: 'from-red-500 to-red-600',
    postCount: 634
  },
  {
    id: 'content',
    name: 'Custom Content',
    description: 'Share maps, skins, and mods',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600',
    postCount: 378
  },
  {
    id: 'teams',
    name: 'Team Recruitment',
    description: 'Find teammates and join clans',
    icon: '👥',
    color: 'from-indigo-500 to-indigo-600',
    postCount: 267
  },
  {
    id: 'feedback',
    name: 'Feedback & Suggestions',
    description: 'Help shape the future of KeyJam',
    icon: '💡',
    color: 'from-cyan-500 to-cyan-600',
    postCount: 523
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'RhythmGod',
    avatar: '👑',
    elo: 2847,
    rank: 'Grandmaster',
    joinDate: new Date('2022-03-15'),
    totalPosts: 1247,
    totalLikes: 8934,
    isOnline: true,
    forumLevel: 25,
    forumXP: 12450,
    title: 'Forum Legend',
    badges: [
      { id: '1', name: 'First Post', icon: '🌟', description: 'Made your first forum post', rarity: 'common', earnedAt: new Date('2022-03-16') },
      { id: '2', name: 'Helpful Helper', icon: '🤝', description: 'Received 100+ helpful votes', rarity: 'rare', earnedAt: new Date('2022-05-20') },
      { id: '3', name: 'Community Champion', icon: '🏆', description: 'Top contributor for 3 months', rarity: 'legendary', earnedAt: new Date('2023-01-10') }
    ]
  },
  {
    id: '2',
    username: 'BeatMaster99',
    avatar: '🤖',
    elo: 2156,
    rank: 'Master',
    joinDate: new Date('2022-07-22'),
    totalPosts: 634,
    totalLikes: 2847,
    isOnline: false,
    forumLevel: 18,
    forumXP: 7890,
    title: 'Strategy Guru',
    badges: []
  },
  {
    id: '3',
    username: 'NoteMaster',
    avatar: '🎵',
    elo: 1934,
    rank: 'Diamond',
    joinDate: new Date('2023-01-10'),
    totalPosts: 289,
    totalLikes: 1256,
    isOnline: true,
    forumLevel: 12,
    forumXP: 3420,
    badges: []
  }
];

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: '🎉 Season 2 Championship Finals - Live This Weekend!',
    content: 'The biggest tournament of the year is happening this weekend! 64 of the world\'s best players will compete for a $100,000 prize pool...',
    author: mockUsers[0],
    category: categories[3],
    tags: ['tournament', 'championship', 'live'],
    upvotes: 247,
    downvotes: 3,
    replies: 89,
    views: 4567,
    isPinned: true,
    isLocked: false,
    isTrending: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 15 * 60 * 1000),
    lastReply: { author: mockUsers[1], createdAt: new Date(Date.now() - 15 * 60 * 1000) }
  },
  {
    id: '2',
    title: 'Advanced Polyrhythm Techniques - Complete Guide',
    content: 'After 2000+ hours of gameplay, here are my top strategies for mastering complex polyrhythmic patterns...',
    author: mockUsers[1],
    category: categories[2],
    tags: ['guide', 'advanced', 'polyrhythm'],
    upvotes: 156,
    downvotes: 8,
    replies: 45,
    views: 2340,
    isPinned: false,
    isLocked: false,
    isTrending: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    lastReply: { author: mockUsers[2], createdAt: new Date(Date.now() - 30 * 60 * 1000) }
  },
  {
    id: '3',
    title: 'Custom Skin Showcase: Neon Dreams Theme Pack',
    content: 'I\'ve been working on this cyberpunk-inspired skin pack for months. Features animated backgrounds, custom note designs...',
    author: mockUsers[2],
    category: categories[5],
    tags: ['skin', 'custom', 'cyberpunk'],
    upvotes: 89,
    downvotes: 2,
    replies: 23,
    views: 1567,
    isPinned: false,
    isLocked: false,
    isTrending: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

interface ForumProps {
  onBack: () => void;
  onPostClick: (postId: string) => void;
  onNewPost: (categoryId?: string) => void;
}

export const Forum: React.FC<ForumProps> = ({ onBack, onPostClick, onNewPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = mockPosts;
    
    if (selectedCategory) {
      posts = posts.filter(post => post.category.id === selectedCategory);
    }
    
    if (searchQuery) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return posts.sort((a, b) => {
      switch (sortBy) {
        case 'hot':
          const aScore = (a.upvotes - a.downvotes) / Math.max(1, (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60));
          const bScore = (b.upvotes - b.downvotes) / Math.max(1, (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60));
          return bScore - aScore;
        case 'new':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'top':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        default:
          return 0;
      }
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${postId}`);
  };

  const handleNewPostClick = () => {
    onNewPost(selectedCategory || undefined);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${Math.floor(diff / (1000 * 60))}m ago`;
  };

  const getRankColor = (rank: string) => {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0', 
      'Gold': '#ffd700',
      'Platinum': '#e5e4e2',
      'Diamond': '#b9f2ff',
      'Master': '#ff6b35',
      'Grandmaster': '#ff1744'
    };
    return colors[rank as keyof typeof colors] || '#666';
  };

  const getBadgeRarityColor = (rarity: string) => {
    const colors = {
      'common': 'from-gray-500 to-gray-600',
      'rare': 'from-blue-500 to-blue-600',
      'epic': 'from-purple-500 to-purple-600',
      'legendary': 'from-yellow-500 to-orange-500'
    };
    return colors[rarity as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className="h-full">
        <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="h-full">
          <div className="flex flex-col h-full py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                  ← Back to Forum
                </button>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category?.color} flex items-center justify-center text-white text-2xl`}>
                    {category?.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{category?.name}</h1>
                    <p className="text-gray-400">{category?.description}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleNewPostClick}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105"
              >
                📝 New Post
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="hot">🔥 Hot</option>
                <option value="new">🆕 New</option>
                <option value="top">⬆️ Top</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onVote={handleVote} 
                  onPostClick={onPostClick}
                  formatTimeAgo={formatTimeAgo} 
                  getRankColor={getRankColor} 
                  getBadgeRarityColor={getBadgeRarityColor} 
                />
              ))}
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div className="h-full">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="h-full">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Community Forum</h1>
              <p className="text-gray-400 mt-1">Connect, share, and learn with the KeyJam community</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Posts</h2>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="hot">🔥 Hot</option>
                    <option value="new">🆕 New</option>
                    <option value="top">⬆️ Top</option>
                  </select>
                  <button 
                    onClick={handleNewPostClick}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-white font-bold text-sm transition-all duration-200 hover:scale-105"
                  >
                    📝 New Post
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {mockPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onVote={handleVote} 
                    onPostClick={onPostClick}
                    formatTimeAgo={formatTimeAgo} 
                    getRankColor={getRankColor} 
                    getBadgeRarityColor={getBadgeRarityColor} 
                    compact 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📂 Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {category.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {category.name}
                          {category.isOfficial && <span className="ml-1 text-blue-400">✓</span>}
                        </div>
                        <div className="text-xs text-gray-400">{category.postCount} posts</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  🔥 Trending Topics
                </h3>
                <div className="space-y-3">
                  {['#championship', '#polyrhythm-guide', '#custom-skins', '#tournament-tips', '#beginner-help'].map((tag, index) => (
                    <div key={tag} className="flex items-center justify-between">
                      <span className="text-cyan-400 font-medium">{tag}</span>
                      <span className="text-gray-400 text-sm">{Math.floor(Math.random() * 100) + 50} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  👑 Top Contributors
                </h3>
                <div className="space-y-3">
                  {mockUsers.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white flex items-center gap-1">
                          {user.username}
                          {user.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                        </div>
                        <div className="text-xs text-gray-400">{user.totalLikes} likes</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-cyan-400">Lv.{user.forumLevel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

interface PostCardProps {
  post: ForumPost;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onPostClick: (postId: string) => void;
  formatTimeAgo: (date: Date) => string;
  getRankColor: (rank: string) => string;
  getBadgeRarityColor: (rarity: string) => string;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onVote, 
  onPostClick,
  formatTimeAgo, 
  getRankColor, 
  getBadgeRarityColor, 
  compact = false 
}) => {
  const voteScore = post.upvotes - post.downvotes;
  
  return (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onVote(post.id, 'up')}
            className={`p-1 rounded hover:bg-slate-600 transition-colors ${
              post.userVote === 'up' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
            </svg>
          </button>
          <span className={`font-bold text-sm ${
            voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {voteScore > 0 ? '+' : ''}{voteScore}
          </span>
          <button
            onClick={() => onVote(post.id, 'down')}
            className={`p-1 rounded hover:bg-slate-600 transition-colors ${
              post.userVote === 'down' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 20l-8-8h6V4h4v8h6l-8 8z"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {post.isPinned && (
                <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-xs font-bold">
                  📌 PINNED
                </span>
              )}
              {post.isTrending && (
                <span className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs font-bold">
                  🔥 TRENDING
                </span>
              )}
              <span className={`bg-gradient-to-r ${post.category.color} px-2 py-1 rounded text-xs font-bold text-white`}>
                {post.category.icon} {post.category.name}
              </span>
            </div>
          </div>

          <h3 
            className={`font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer ${compact ? 'text-base' : 'text-lg'} mb-2`}
            onClick={() => onPostClick(post.id)}
          >
            {post.title}
          </h3>

          {!compact && (
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {post.content}
            </p>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="text-xl">{post.author.avatar}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{post.author.username}</span>
                  {post.author.title && (
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">
                      {post.author.title}
                    </span>
                  )}
                  {post.author.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: getRankColor(post.author.rank) }} className="font-bold">
                    {post.author.rank}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-cyan-400">{post.author.elo} ELO</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-400">Lv.{post.author.forumLevel}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{post.author.totalPosts} posts</span>
                </div>
              </div>
            </div>
            {post.author.badges.length > 0 && (
              <div className="flex gap-1">
                {post.author.badges.slice(0, 2).map((badge) => (
                  <div
                    key={badge.id}
                    className={`w-6 h-6 rounded bg-gradient-to-r ${getBadgeRarityColor(badge.rarity)} flex items-center justify-center text-sm`}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    {badge.icon}
                  </div>
                ))}
                {post.author.badges.length > 2 && (
<div className="w-6 h-6 rounded bg-slate-600 flex items-center justify-center text-xs text-gray-300">
                   +{post.author.badges.length - 2}
                 </div>
               )}
             </div>
           )}
         </div>

         <div className="flex items-center gap-1 mb-2">
           {post.tags.map((tag) => (
             <span key={tag} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs hover:bg-slate-600 cursor-pointer transition-colors">
               #{tag}
             </span>
           ))}
         </div>

         <div className="flex items-center justify-between text-sm text-gray-400">
           <div className="flex items-center gap-4">
             <span className="flex items-center gap-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
               {post.replies}
             </span>
             <span className="flex items-center gap-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
               {post.views}
             </span>
             <span>{formatTimeAgo(post.createdAt)}</span>
           </div>
           {post.lastReply && (
             <div className="flex items-center gap-1">
               <span>Last:</span>
               <span className="font-medium">{post.lastReply.author.username}</span>
               <span>{formatTimeAgo(post.lastReply.createdAt)}</span>
             </div>
           )}
         </div>
       </div>
     </div>
   </div>
 );
};

export default Forum;