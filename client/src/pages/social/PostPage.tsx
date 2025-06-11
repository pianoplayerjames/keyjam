import React, { useState } from 'react';
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

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  replies?: Reply[];
  isDeleted?: boolean;
  editedAt?: Date;
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
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isTrending: boolean;
  createdAt: Date;
  editedAt?: Date;
  replies: Reply[];
}

const mockUser: User = {
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
};

const mockCategory: ForumCategory = {
  id: 'strategy',
  name: 'Strategy & Tips',
  description: 'Share your techniques and get advice',
  icon: '🎯',
  color: 'from-purple-500 to-purple-600'
};

const mockPost: ForumPost = {
  id: '1',
  title: 'Advanced Polyrhythm Techniques - Complete Guide for Grandmaster Level',
  content: `After spending over 2000 hours perfecting my technique and reaching Grandmaster rank, I wanted to share some advanced polyrhythm strategies that helped me break through the Diamond/Master barrier.

## Understanding Polyrhythmic Patterns

Polyrhythms are essentially multiple rhythmic patterns playing simultaneously. In KeyJam, these typically appear in Expert and Master difficulty songs starting around the 70+ difficulty range.

### The Foundation: 3-against-2 Patterns

The most common polyrhythm you'll encounter is 3-against-2. Here's how to approach it:

1. **Mental Subdivision**: Think of the beat as divided into 6 equal parts
2. **Hand Independence**: Practice each hand separately first
3. **Gradual Integration**: Slowly combine the patterns

### Advanced Techniques

**Cross-Hand Patterns**: These require you to cross your dominant hand over your non-dominant hand. The key is:
- Start slow (50% speed)
- Focus on smooth motion, not speed
- Use your shoulder, not just your wrist

**Syncopated Polyrhythms**: When the polyrhythm is offset from the main beat:
- Count out loud initially
- Use a metronome set to the underlying pulse
- Practice with different accent patterns

## Practice Routine

Here's my daily 30-minute routine that took me from Diamond to Grandmaster:

1. **5 minutes**: Basic polyrhythm patterns at slow speed
2. **10 minutes**: Song-specific practice on problem sections
3. **10 minutes**: Full song runs with focus on consistency
4. **5 minutes**: Freestyle practice on random polyrhythmic patterns

## Mental Approach

The biggest breakthrough for me was changing how I think about these patterns:
- Don't try to "think" each note individually
- Let your muscle memory take over
- Focus on the feel and flow rather than precise timing

## Common Mistakes

1. **Rushing**: Polyrhythms feel slow, resist the urge to speed up
2. **Tension**: Keep your hands and shoulders relaxed
3. **Overthinking**: Trust your practice and let it flow

Feel free to ask questions! I'll be monitoring this thread and happy to help anyone struggling with these concepts.

*Pro tip: If you're still struggling, try practicing these patterns away from the game first. Tap them out on a table or use a practice pad.*`,
  author: mockUser,
  category: mockCategory,
  tags: ['guide', 'advanced', 'polyrhythm', 'grandmaster', 'practice'],
  upvotes: 347,
  downvotes: 12,
  views: 5674,
  isPinned: false,
  isLocked: false,
  isTrending: true,
  createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  replies: [
    {
      id: '1',
      content: 'This is exactly what I needed! Been stuck at Diamond for months. The cross-hand section is pure gold 🔥',
      author: {
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
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      upvotes: 23,
      downvotes: 1,
      replies: [
        {
          id: '1-1',
          content: 'Glad it helped! The cross-hand technique took me about 2 weeks to get comfortable with. Don\'t give up!',
          author: mockUser,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          upvotes: 15,
          downvotes: 0
        }
      ]
    },
    {
      id: '2',
      content: 'Amazing guide! Question about the 3-against-2 patterns - do you have any specific songs you recommend for practice?',
      author: {
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
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      upvotes: 8,
      downvotes: 0
    }
  ]
};

interface PostPageProps {
  onBack: () => void;
}

export const PostPage: React.FC<PostPageProps> = ({ onBack }) => {
  const [newReplyContent, setNewReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const handleVote = (id: string, voteType: 'up' | 'down', isPost = false) => {
    console.log(`Voting ${voteType} on ${isPost ? 'post' : 'reply'} ${id}`);
  };

  const handleReply = (replyId?: string) => {
    if (replyId) {
      setReplyingTo(replyId);
    } else {
      setShowReplyEditor(true);
    }
  };

  const handleSubmitReply = () => {
    console.log('Submitting reply:', newReplyContent);
    setNewReplyContent('');
    setReplyingTo(null);
    setShowReplyEditor(false);
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

  const voteScore = mockPost.upvotes - mockPost.downvotes;

  return (
    <div className="h-full">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="h-full">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              ← Back to Forum
            </button>
            <span className={`bg-gradient-to-r ${mockPost.category.color} px-3 py-1 rounded text-sm font-bold text-white`}>
              {mockPost.category.icon} {mockPost.category.name}
            </span>
            {mockPost.isTrending && (
              <span className="bg-red-600/20 text-red-300 px-3 py-1 rounded text-sm font-bold">
                🔥 TRENDING
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleVote(mockPost.id, 'up', true)}
                        className={`p-2 rounded hover:bg-slate-600 transition-colors ${
                          mockPost.userVote === 'up' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
                        </svg>
                      </button>
                      <span className={`font-bold text-lg ${
                        voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {voteScore > 0 ? '+' : ''}{voteScore}
                      </span>
                      <button
                        onClick={() => handleVote(mockPost.id, 'down', true)}
                        className={`p-2 rounded hover:bg-slate-600 transition-colors ${
                          mockPost.userVote === 'down' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 20l-8-8h6V4h4v8h6l-8 8z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-white mb-4">{mockPost.title}</h1>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{mockPost.author.avatar}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{mockPost.author.username}</span>
                              {mockPost.author.title && (
                                <span className="text-sm bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                                  {mockPost.author.title}
                                </span>
                              )}
                              {mockPost.author.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span style={{ color: getRankColor(mockPost.author.rank) }} className="font-bold">
                                {mockPost.author.rank}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-cyan-400">{mockPost.author.elo} ELO</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-purple-400">Lv.{mockPost.author.forumLevel}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-400">{mockPost.author.totalPosts} posts</span>
                            </div>
                          </div>
                        </div>
                        {mockPost.author.badges.length > 0 && (
                          <div className="flex gap-1">
                            {mockPost.author.badges.map((badge) => (
                              <div
                                key={badge.id}
                                className={`w-8 h-8 rounded bg-gradient-to-r ${getBadgeRarityColor(badge.rarity)} flex items-center justify-center`}
                                title={`${badge.name}: ${badge.description}`}
                              >
                                {badge.icon}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {mockPost.tags.map((tag) => (
                          <span key={tag} className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-slate-600 cursor-pointer transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <div className="text-gray-200 whitespace-pre-line leading-relaxed">
                          {mockPost.content}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400 mt-6 pt-4 border-t border-slate-600">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {mockPost.views} views
                          </span>
                          <span>{formatTimeAgo(mockPost.createdAt)}</span>
                          {mockPost.editedAt && (
                            <span>• Edited {formatTimeAgo(mockPost.editedAt)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleReply()}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {showReplyEditor && (
                  <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Reply to Post</h3>
                    <textarea
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-400">
                        💡 Tip: Use markdown for formatting! **bold**, *italic*, `code`
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowReplyEditor(false)}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitReply}
                          disabled={!newReplyContent.trim()}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    💬 Replies ({mockPost.replies.length})
                  </h3>
                  
                  {mockPost.replies.map((reply) => (
                    <ReplyCard 
                      key={reply.id} 
                      reply={reply} 
                      onVote={handleVote} 
                      onReply={handleReply}
                      formatTimeAgo={formatTimeAgo}
                      getRankColor={getRankColor}
                      getBadgeRarityColor={getBadgeRarityColor}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      newReplyContent={newReplyContent}
                      setNewReplyContent={setNewReplyContent}
                      handleSubmitReply={handleSubmitReply}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Post Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Score</span>
                      <span className="text-green-400 font-bold">+{voteScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views</span>
                      <span className="text-blue-400 font-bold">{mockPost.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Replies</span>
                      <span className="text-purple-400 font-bold">{mockPost.replies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-gray-300">{formatTimeAgo(mockPost.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Author Profile</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{mockPost.author.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{mockPost.author.username}</div>
                      <div style={{ color: getRankColor(mockPost.author.rank) }} className="text-sm font-bold">
                        {mockPost.author.rank}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Forum Level</span>
                      <span className="text-purple-400 font-bold">Lv.{mockPost.author.forumLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ELO Rating</span>
                      <span className="text-cyan-400 font-bold">{mockPost.author.elo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Posts</span>
                      <span className="text-gray-300">{mockPost.author.totalPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Likes</span>
                      <span className="text-yellow-400 font-bold">{mockPost.author.totalLikes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Joined</span>
                      <span className="text-gray-300">{mockPost.author.joinDate.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {mockPost.author.badges.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-white mb-2">Badges</h4>
                      <div className="grid grid-cols-3 gap-1">
                        {mockPost.author.badges.map((badge) => (
                          <div
                            key={badge.id}
                            className={`w-10 h-10 rounded bg-gradient-to-r ${getBadgeRarityColor(badge.rarity)} flex items-center justify-center text-lg`}
                            title={`${badge.name}: ${badge.description}`}
                          >
                            {badge.icon}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                    View Full Profile
                  </button>
                </div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Related Posts</h3>
                  <div className="space-y-3">
                    {[
                      'Mastering Cross-Hand Techniques',
                      'Diamond to Master: My Journey',
                      'Best Practice Songs for Polyrhythms'
                    ].map((title, index) => (
                      <div key={index} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 cursor-pointer transition-colors">
                        <div className="font-medium text-white text-sm">{title}</div>
                        <div className="text-xs text-gray-400 mt-1">Strategy & Tips • 2h ago</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

interface ReplyCardProps {
  reply: Reply;
  onVote: (id: string, voteType: 'up' | 'down') => void;
  onReply: (replyId: string) => void;
  formatTimeAgo: (date: Date) => string;
  getRankColor: (rank: string) => string;
  getBadgeRarityColor: (rarity: string) => string;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  newReplyContent: string;
  setNewReplyContent: (content: string) => void;
  handleSubmitReply: () => void;
  depth?: number;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ 
  reply, 
  onVote, 
  onReply, 
  formatTimeAgo, 
  getRankColor, 
  getBadgeRarityColor,
  replyingTo,
  setReplyingTo,
  newReplyContent,
  setNewReplyContent,
  handleSubmitReply,
  depth = 0 
}) => {
  const voteScore = reply.upvotes - reply.downvotes;
  const maxDepth = 3;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-slate-600 pl-4' : ''}`}>
      <div className="bg-slate-800/30 rounded-lg border border-slate-600/30 p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onVote(reply.id, 'up')}
              className={`p-1 rounded hover:bg-slate-600 transition-colors ${
                reply.userVote === 'up' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
              </svg>
            </button>
            <span className={`font-bold text-xs ${
              voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {voteScore > 0 ? '+' : ''}{voteScore}
            </span>
            <button
              onClick={() => onVote(reply.id, 'down')}
              className={`p-1 rounded hover:bg-slate-600 transition-colors ${
                reply.userVote === 'down' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 20l-8-8h6V4h4v8h6l-8 8z"/>
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg">{reply.author.avatar}</div>
              <span className="font-medium text-white">{reply.author.username}</span>
              <span style={{ color: getRankColor(reply.author.rank) }} className="text-xs font-bold">
                {reply.author.rank}
              </span>
              <span className="text-cyan-400 text-xs">{reply.author.elo} ELO</span>
<span className="text-purple-400 text-xs">Lv.{reply.author.forumLevel}</span>
             {reply.author.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
             <span className="text-gray-400 text-xs">• {formatTimeAgo(reply.createdAt)}</span>
             {reply.editedAt && (
               <span className="text-gray-500 text-xs">• Edited</span>
             )}
           </div>

           <div className="text-gray-200 text-sm mb-3 leading-relaxed">
             {reply.content}
           </div>

           <div className="flex items-center gap-3 text-xs">
             {depth < maxDepth && (
               <button
                 onClick={() => onReply(reply.id)}
                 className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
               >
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                 </svg>
                 Reply
               </button>
             )}
             <button className="text-gray-400 hover:text-yellow-400 transition-colors">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
             </button>
             <button className="text-gray-400 hover:text-red-400 transition-colors">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
             </button>
           </div>
         </div>
       </div>

       {replyingTo === reply.id && (
         <div className="mt-4 ml-7">
           <div className="bg-slate-700/50 rounded-lg p-3">
             <textarea
               value={newReplyContent}
               onChange={(e) => setNewReplyContent(e.target.value)}
               placeholder={`Reply to ${reply.author.username}...`}
               className="w-full h-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-sm"
             />
             <div className="flex items-center justify-end gap-2 mt-2">
               <button
                 onClick={() => setReplyingTo(null)}
                 className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSubmitReply}
                 disabled={!newReplyContent.trim()}
                 className="px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white text-sm font-medium transition-colors"
               >
                 Reply
               </button>
             </div>
           </div>
         </div>
       )}
     </div>

     {reply.replies && reply.replies.length > 0 && depth < maxDepth && (
       <div className="mt-3 space-y-3">
         {reply.replies.map((subReply) => (
           <ReplyCard
             key={subReply.id}
             reply={subReply}
             onVote={onVote}
             onReply={onReply}
             formatTimeAgo={formatTimeAgo}
             getRankColor={getRankColor}
             getBadgeRarityColor={getBadgeRarityColor}
             replyingTo={replyingTo}
             setReplyingTo={setReplyingTo}
             newReplyContent={newReplyContent}
             setNewReplyContent={setNewReplyContent}
             handleSubmitReply={handleSubmitReply}
             depth={depth + 1}
           />
         ))}
       </div>
     )}
   </div>
 );
};

export default PostPage;