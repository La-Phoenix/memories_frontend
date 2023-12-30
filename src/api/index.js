import axios from "axios";
// https://mern-memorieslaphoenix.herokuapp.com/api
const API = axios.create({
  baseURL: "https://memories-server-402c.onrender.com/api",
});
// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

API.interceptors.request.use((req) => {
  const profile = JSON.parse(localStorage.getItem("Profile"));
  if (profile) {
    req.headers.authorization = `Bearer ${profile.token}`;
  }
  return req;
});

export const getPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const getPostBySearch = (searchQuery) =>
  API.get(
    `posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
export const createPosts = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const likeCountupdate = (id) => API.patch(`/posts/${id}/likePost`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const commentPost = (value, id) =>
  API.post(`/posts/${id}/commentPost`, { value });

export const signUp = (formData) => API.post("/user/signUp", formData);
export const signIn = (formData) => API.post("/user/signIn", formData);
