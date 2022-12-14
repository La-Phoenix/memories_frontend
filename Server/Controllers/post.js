import mongoose from "mongoose";
import PostMessage from "../Models/postMessage.js";

export const getPosts = async (req, res, next) => {
  const { page } = req.query;
  try {
    const LIMIT = 4;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostMessage.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Sorry, could not find such post." });
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPostsSearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  const tagsArray = tags.split(",");
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tagsArray } }],
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res, next) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { postId: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No post with that id`);
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, _id },
      {
        new: true,
      }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const likeCountupdate = async (req, res) => {
  const { postId: _id } = req.params;
  if (!req.userId)
    return res
      .status(400)
      .json({ message: "Unauthorised! Try signing In or signing Up." });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No post with that id`);
  try {
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { postId } = req.params;
  const { value } = req.body;
  try {
    const post = await PostMessage.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Sorry, could not find such post." });
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No post with that id`);
  try {
    await PostMessage.findByIdAndRemove(_id);

    res.status(200).json({ message: "Post successfully deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
