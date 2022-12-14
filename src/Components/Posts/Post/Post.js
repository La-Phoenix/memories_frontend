import {
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import React from "react";
import moment from "moment";

import useStyles from "./Styles";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  deletePost,
  likeCountupdate,
} from "../../../features/postSlice";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../../Utils/Error/ErrorModal";

function Post({ post, setCurrentId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { error } = useSelector((state) => state.posts);

  const user = JSON.parse(localStorage.getItem("Profile"));
  const navigate = useNavigate();

  const Likes = () => {
    if (post.likes.length > 0) {
      return post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {post.likes.length > 2
            ? `You and ${post.likes.length - 1} others`
            : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };
  const OpenPost = () => navigate(`/posts/${post._id}`);

  return (
    <>
      <ErrorModal error={error} onClear={() => dispatch(clearError())} />
      <Card className={classes.card} raised elevation={6}>
        <ButtonBase
          component="span"
          name="test"
          className={classes.cardAction}
          onClick={OpenPost}
        >
          <CardMedia
            className={classes.media}
            image={post.selectedFile}
            title={post.title}
          />
          <div className={classes.overlay}>
            <Typography variant="h6">{post.name}</Typography>
            <Typography variant="body2">
              {moment(post.createdAt).fromNow()}
            </Typography>
          </div>
          {(user?.result?.googleId === post?.creator ||
            user?.result?._id === post?.creator) && (
            <div className={classes.overlay2}>
              <Button
                style={{ color: "white" }}
                size="medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentId(post._id);
                }}
              >
                <MoreHorizIcon fontSize="large" />
              </Button>
            </div>
          )}
          <div className={classes.details}>
            <Typography variant="body2" color="textSecondary">
              {post.tags.map((tag) => `#${tag} `)}
            </Typography>
          </div>
          <Typography className={classes.title} variant="h5" gutterBottom>
            {post.title}
          </Typography>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {post.message}
            </Typography>
          </CardContent>
        </ButtonBase>
        <CardActions className={classes.cardActions}>
          <Button
            size="small"
            color="primary"
            disabled={!user?.result}
            onClick={() => {
              dispatch(likeCountupdate(post._id));
            }}
          >
            <Likes />
          </Button>
          {(user?.result?.googleId === post?.creator ||
            user?.result?._id === post?.creator) && (
            <Button
              size="small"
              color="primary"
              onClick={() => {
                dispatch(deletePost({ id: post._id, dispatch }));
              }}
            >
              <DeleteIcon fontSize="small" />
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
}

export default Post;
