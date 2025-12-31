import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '@/services/forumService';

export function useForum(params) {
  const queryClient = useQueryClient();

  const posts = useQuery({ queryKey: ['forum-posts', params], queryFn: () => forumService.getPosts(params) });
  const categories = useQuery({ queryKey: ['forum-categories'], queryFn: forumService.getCategories });

  const createPost = useMutation({
    mutationFn: forumService.createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forum-posts'] }),
  });

  const deletePost = useMutation({
    mutationFn: forumService.deletePost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-post', variables] });
    },
  });

  const addComment = useMutation({
    mutationFn: ({ postId, data }) => forumService.addComment(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: ({ postId, commentId }) => forumService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['forum-post', variables.postId] }),
  });

  const likePost = useMutation({
    mutationFn: forumService.likePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forum-posts'] }),
  });

  return { posts, categories, createPost, deletePost, addComment, deleteComment, likePost };
}

export function useForumPost(postId) {
  return useQuery({ queryKey: ['forum-post', postId], queryFn: () => forumService.getPost(postId), enabled: !!postId });
}
