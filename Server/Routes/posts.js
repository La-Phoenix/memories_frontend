import express from "express";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likeCountupdate,
  getPostsSearch,
  getPost,
  commentPost,
} from "../Controllers/post.js";
import auth from "../Middleware/auth.js";
const Router = express.Router();
const app = express();

Router.get("/search", getPostsSearch);
Router.get("/", getPosts);
Router.get("/:postId", getPost);

Router.post("/", auth, createPost);

Router.patch("/:postId", auth, updatePost);
Router.patch("/:postId/likePost", auth, likeCountupdate);
Router.post("/:postId/commentPost", auth, commentPost);
Router.delete("/:id", auth, deletePost);

export default Router;
