'use client';

import { useState } from 'react';
import { useForum } from '@/hooks/useForum';
import { PostForm } from '@/components/forum/PostForm';
import { PostCard } from '@/components/forum/PostCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'general', label: 'General' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'stress', label: 'Stress' },
  { value: 'success', label: 'Success Stories' },
];

export default function ForumContent() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const {
    posts,
    likePost,
    deletePost,
    addComment,
  } = useForum({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  const postList = posts.data?.data?.posts || posts.data?.posts || [];

  const handleLike = async (postId) => {
    try {
      await likePost.mutateAsync(postId);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(postId);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleAddComment = async ({ postId, ...commentData }) => {
    try {
      await addComment.mutateAsync({ postId, data: commentData });
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-900 dark:to-cyan-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
          <p className="text-xl text-teal-50">Share experiences and support one another</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header with button */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Posts</h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              New Post
            </Button>
          </div>

          {/* New Post Form */}
          {showForm && (
            <div className="mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <PostForm onSubmit={() => setShowForm(false)} />
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Filter by Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:bg-gray-900 dark:border-gray-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Posts List */}
          {posts.isLoading ? (
            <div className="py-16 text-center">
              <LoadingSpinner label="Loading posts..." />
            </div>
          ) : posts.error ? (
            <ErrorMessage message={String(posts.error)} />
          ) : postList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No posts yet. Be the first to share!
              </p>
              <Button onClick={() => setShowForm(true)}>Create First Post</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {postList.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
