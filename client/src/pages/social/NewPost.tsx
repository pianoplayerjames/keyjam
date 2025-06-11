import React, { useState } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

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

interface NewPostProps {
  onBack: () => void;
  onPostCreated: () => void;
  preselectedCategory?: string | null;
}

export const NewPost: React.FC<NewPostProps> = ({ onBack, onPostCreated, preselectedCategory }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory || '');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !selectedCategory) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating post:', {
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCategory,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      
      setIsSubmitting(false);
      onPostCreated();
    }, 1000);
  };

  const isFormValid = title.trim() && content.trim() && selectedCategory;

  return (
    <div className="h-full">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="h-full">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Post</h1>
              <p className="text-gray-400 mt-1">Share your knowledge with the KeyJam community</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              ← Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's your post about?"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        maxLength={200}
                      />
                      <div className="text-right text-xs text-gray-400 mt-1">
                        {title.length}/200
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.filter(c => !c.isOfficial).map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              selectedCategory === category.id
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white flex-shrink-0`}>
                              {category.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-white text-sm">{category.name}</div>
                              <div className="text-xs text-gray-400">{category.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="guide, advanced, tips (comma separated)"
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Add relevant tags to help others find your post
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white font-medium">
                          Content <span className="text-red-400">*</span>
                        </label>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm transition-colors"
                        >
                          {showPreview ? 'Edit' : 'Preview'}
                        </button>
                      </div>
                      
                      {showPreview ? (
                        <div className="w-full min-h-[300px] p-4 bg-slate-700 border border-slate-600 rounded-lg">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-gray-200 whitespace-pre-line leading-relaxed">
                              {content || 'Nothing to preview yet...'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Share your knowledge, ask a question, or start a discussion..."
                          className="w-full h-64 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                        />
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Supports markdown formatting</span>
                        <span>{content.length} characters</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span className="text-red-400">*</span> Required fields
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onBack}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isFormValid || isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Creating Post...' : 'Create Post'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedCategoryData && (
                  <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                    <h3 className="text-lg font-bold text-white mb-3">Selected Category</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedCategoryData.color} flex items-center justify-center text-white text-xl`}>
                        {selectedCategoryData.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{selectedCategoryData.name}</div>
                        <div className="text-sm text-gray-400">{selectedCategoryData.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedCategoryData.postCount} posts in this category
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-3">📝 Posting Tips</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium text-white mb-1">Write a clear title</div>
                      <div className="text-gray-400">Make it descriptive and specific to attract the right audience</div>
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1">Choose the right category</div>
                      <div className="text-gray-400">This helps people find your post and keeps discussions organized</div>
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1">Use formatting</div>
                      <div className="text-gray-400">**bold**, *italic*, `code`, and line breaks make posts easier to read</div>
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1">Add relevant tags</div>
                      <div className="text-gray-400">Tags help with search and discovery</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-3">🏆 Rewards</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Creating a post</span>
                      <span className="text-green-400 font-bold">+10 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">First upvote</span>
                      <span className="text-blue-400 font-bold">+5 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Helpful post (10+ upvotes)</span>
                      <span className="text-purple-400 font-bold">+25 XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Popular post (50+ upvotes)</span>
                      <span className="text-yellow-400 font-bold">Badge + 100 XP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 p-4">
                  <h3 className="text-lg font-bold text-white mb-3">📋 Community Guidelines</h3>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div>• Be respectful and constructive</div>
                    <div>• Stay on topic for your chosen category</div>
                    <div>• No spam, self-promotion, or duplicate posts</div>
                    <div>• Use appropriate language</div>
                    <div>• Search before posting to avoid duplicates</div>
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

export default NewPost;