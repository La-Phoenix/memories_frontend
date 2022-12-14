import express from "express";
import { signIn, signUp } from "../Controllers/user.js";
const Router = express.Router();

Router.post("/signUp", signUp);
Router.post("/signIn", signIn);

export default Router;
