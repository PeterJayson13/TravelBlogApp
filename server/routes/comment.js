const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verify, verifyAdmin } = require('../auth');

// Get comments for a post (public)
router.get('/post/:id', commentController.getCommentsByPost);

// Add comment to a post (authenticated)
router.post('/post/:id', verify, commentController.addComment);

// Delete comment (admin only)
router.delete('/:id', verify, verifyAdmin, commentController.deleteComment);

module.exports = router;
