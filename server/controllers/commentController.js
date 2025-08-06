const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// Add a comment to a post [Authenticated users only]
exports.addComment = async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;

  try {
    const postExists = await BlogPost.findById(postId);
    if (!postExists) return res.status(404).json({ message: 'Post not found' });

    const newComment = await Comment.create({
      postId,
      userId: req.user.id,
      comment
    });

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

// Get all comments for a specific post [Public]
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
};

// Delete a comment [Admin only]
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error });
  }
};
