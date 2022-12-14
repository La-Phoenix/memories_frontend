import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./Routes/posts.js";
import usersRoutes from "./Routes/users.js";

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/user", usersRoutes);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING.");
});

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

const url = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
mongoose
  .connect(url)
  .then(() => {
    app.listen(port, () => {
      console.log(`LISTENING AT ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
