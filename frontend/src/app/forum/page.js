"use client";

import { useState } from 'react';
import { useForum } from '@/hooks/useForum';
import { PostForm } from '@/components/forum/PostForm';
import { PostCard } from '@/components/forum/PostCard';
import { CategoryFilter } from '@/components/forum/CategoryFilter';
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

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPostForm, setShowPostForm] = useState(false);

  const { posts, likePost, deletePost, addComment, createPost } = useForum({
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

  const handleCreatePost = async (data) => {
    try {
      await createPost.mutateAsync(data);
      setShowPostForm(false);
    } catch (err) {
      console.error('Create post failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 pb-14 pt-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm dark:bg-teal-900 dark:text-teal-100">
              <span className="text-base">💬</span>
              <span>Community Forum</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Share, support, and grow together</h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Join conversations, ask questions, and encourage others on their mental wellness journey.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-6">
        <div className="container mx-auto px-4 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={() => setShowPostForm(true)} className="self-start sm:self-end">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </div>

          {/* Post Form Modal */}
          {showPostForm && <PostForm onCreate={handleCreatePost} />}

          {/* Posts List */}
          {posts.isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner label="Loading posts..." />
            </div>
          )}

          {posts.error && <ErrorMessage message={String(posts.error)} />}

          {!posts.isLoading && postList.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">No posts in this category yet</p>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Be the first to share your thoughts and experiences.</p>
              <Button onClick={() => setShowPostForm(true)}>Be the first to post!</Button>
            </div>
          )}

          {!posts.isLoading && postList.length > 0 && (
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
