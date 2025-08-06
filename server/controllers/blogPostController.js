const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// Create a blog post [Authenticated users only]
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = await BlogPost.create({
      title,
      content,
      author: req.user.id
    });

    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

// Get all blog posts [Public]
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'username');

    if (posts.length === 0) {
      return res.status(200).json({ message: 'No blog posts found', posts: [] });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve posts', error });
  }
};

// Get single blog post by ID [Public]
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve post', error });
  }
};

// Update a post [Owner or Admin only]
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'isAdmin _id');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const currentUserId = req.user.id;
    const currentUserIsAdmin = req.user.isAdmin;
    const postAuthorId = post.author._id.toString();
    const postAuthorIsAdmin = post.author.isAdmin;

    // Restriction logic
    const isOwner = postAuthorId === currentUserId;

    if (
      (postAuthorIsAdmin && !currentUserIsAdmin) || // non-admin trying to edit admin's post
      (!isOwner && !postAuthorIsAdmin) ||           // admin trying to edit user's post
      (!isOwner && currentUserIsAdmin && !postAuthorIsAdmin) // admin editing non-admin post
    ) {
      return res.status(403).json({ message: 'You are not allowed to update this post' });
    }

    // Allow update if passed the restrictions
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated', post: updatedPost });

  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
};

// Delete a post [Owner or Admin only]
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
};
