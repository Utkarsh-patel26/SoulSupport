const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const { protect } = require('../middlewares/auth.middleware');
const { postLimiter } = require('../middlewares/rateLimiter.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createPostSchema,
  createCommentSchema,
} = require('../validators/forum.validator');

router.get('/posts', forumController.getPosts);
router.get('/categories', forumController.getCategories);

router.post(
  '/posts',
  protect,
  postLimiter,
  validate(createPostSchema),
  forumController.createPost
);

router.put(
  '/posts/:id',
  protect,
  validate(createPostSchema.fork(['content', 'category', 'isAnonymous'], (s) => s.optional())),
  forumController.updatePost
);

router.get('/posts/:id', forumController.getPost);

router.delete('/posts/:id', protect, forumController.deletePost);

router.post('/posts/:id/like', protect, forumController.likePost);

router.delete('/posts/:id/like', protect, forumController.unlikePost);

router.post(
  '/posts/:id/comments',
  protect,
  validate(createCommentSchema),
  forumController.addComment
);

router.delete(
  '/posts/:postId/comments/:commentId',
  protect,
  forumController.deleteComment
);

router.post(
  '/posts/:postId/comments/:commentId/like',
  protect,
  forumController.likeComment
);

router.delete(
  '/posts/:postId/comments/:commentId/like',
  protect,
  forumController.unlikeComment
);

module.exports = router;
