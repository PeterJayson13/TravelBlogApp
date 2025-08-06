const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { verify } = require('../auth');

// Public routes
router.get('/', blogPostController.getAllPosts);
router.get('/:id', blogPostController.getPostById);

// Protected routes
router.post('/', verify, blogPostController.createPost);
router.patch('/:id', verify, blogPostController.updatePost);
router.delete('/:id', verify, blogPostController.deletePost);

module.exports = router;
