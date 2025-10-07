const Post = require("../models/posts");
const { isValidObjectId } = require("mongoose");

// get all posts
const getAllPosts = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const skip = (page - 1) * limit;
  const posts = await Post.find({})
    .populate("userId")
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments({});
  res.json({
    status: "success",
    message: "Posts fetched successfully",
    data: posts,
    pagenation: {
      page: Number(page),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
};

// get post by id
const getPostById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid id",
    });
  }
  const post = await Post.findOne({ _id: id }).populate("userId");
  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }
  res.json({
    status: "success",
    message: "Post fetched successfully",
    data: post,
  });
};

// create post
const createPost = async (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res.status(400).json({
      status: "error",
      message: "Title, content and userId are required",
    });
  }

  const post = await Post.create({ title, content, userId });
  res.json({
    status: "success",
    message: "Post created successfully",
    data: post,
  });
};

// update post
const updatePost = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid id",
    });
  }
  const { title, content } = req.body;
  const post = await Post.findOneAndUpdate(
    { _id: id },
    { title, content },
    { new: true }
  );
  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }
  res.json({
    status: "success",
    message: "Post updated successfully",
    data: post,
  });
};

// delete post
const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid id",
    });
  }
  const post = await Post.findOneAndDelete({ _id: id });
  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }
  return res.status(204).send();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
