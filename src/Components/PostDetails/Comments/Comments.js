import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import postSlice, {
  clearError,
  commentPost,
} from "../../../features/postSlice";
import ErrorModal from "../../../Utils/Error/ErrorModal";

import useStyles from "./Styles";

function Comments({ post }) {
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.posts);
  const user = JSON.parse(localStorage.getItem("Profile"));
  // const navigate = useNavigate();
  const { id } = useParams();

  // const newComments = Object.assign([], comments);
  // console.log(error);
  // console.log(comments);

  const handleClick = () => {
    const finalComment = `${user.result.name}: ${comment}`;
    const newComments = dispatch(commentPost({ finalComment, id: post._id }));
    console.log(newComments.arg.finalComment);
    newComments.push([`${newComments.arg.finalComment}`]);
    console.log(newComments);
    // console.log(comments);
    setComment("");
    // setComments(newPost);
  };

  return (
    <div>
      {isLoading && <CircularProgress />}
      <ErrorModal error={error} onClear={() => dispatch(clearError())} />
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              {c}
            </Typography>
          ))}
        </div>
        {user?.result?.name ? (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a comment
            </Typography>
            <TextField
              fullWidth
              minRows={4}
              variant="outlined"
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              color="primary"
              disabled={!comment}
              variant="contained"
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        ) : (
          <Typography gutterBottom variant="h5">
            Sign in to add your comment
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Comments;
