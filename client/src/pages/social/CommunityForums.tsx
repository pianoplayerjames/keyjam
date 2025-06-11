import React, { useState } from 'react';
import { Forum } from './Forum';
import { PostPage } from './PostPage';
import { NewPost } from './NewPost';

interface CommunityForumsProps {
  onBack: () => void;
}

export const CommunityForums: React.FC<CommunityForumsProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'forum' | 'post' | 'newpost'>('forum');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentView('post');
  };

  const handleNewPost = (categoryId?: string) => {
    setSelectedCategory(categoryId || null);
    setCurrentView('newpost');
  };

  const handleBackToForum = () => {
    setCurrentView('forum');
    setSelectedPostId(null);
    setSelectedCategory(null);
  };

  const handlePostCreated = () => {
    setCurrentView('forum');
    setSelectedCategory(null);
  };

  if (currentView === 'post') {
    return <PostPage onBack={handleBackToForum} postId={selectedPostId} />;
  }

  if (currentView === 'newpost') {
    return (
      <NewPost 
        onBack={handleBackToForum} 
        onPostCreated={handlePostCreated}
        preselectedCategory={selectedCategory}
      />
    );
  }

  return <Forum onBack={onBack} onPostClick={handlePostClick} onNewPost={handleNewPost} />;
};

export default CommunityForums;