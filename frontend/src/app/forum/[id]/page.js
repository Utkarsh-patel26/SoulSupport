"use client";

import { useParams } from 'next/navigation';
import { useForumPost, useForum } from '@/hooks/useForum';
import { CommentList } from '@/components/forum/CommentList';
import { CommentForm } from '@/components/forum/CommentForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { PostCard } from '@/components/forum/PostCard';

export default function ForumPostPage() {
  const params = useParams();
  const postId = params?.id;
  const { data, isLoading, error } = useForumPost(postId);
  const { addComment, deleteComment } = useForum();

  const post = data?.data?.post || data?.post;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      {isLoading && <LoadingSpinner label="Loading post..." />}
      {error && <ErrorMessage message={String(error)} />}
      {post && <PostCard post={post} showActions={false} />}
      {post && (
        <CommentList
          comments={post.comments || []}
          onDelete={(commentId) => deleteComment.mutateAsync({ postId, commentId })}
        />
      )}
      {post && <CommentForm onSubmit={(payload) => addComment.mutateAsync({ postId, data: payload })} />}
    </div>
  );
}
