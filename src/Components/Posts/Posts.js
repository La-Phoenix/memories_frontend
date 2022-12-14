import { CircularProgress, Grid } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, postsSlice } from "../../features/postSlice";
import ErrorModal from "../../Utils/Error/ErrorModal";
import Post from "./Post/Post";

import useStyles from "./Styles";
function Posts({ setCurrentId }) {
  const classes = useStyles();
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  if ((!posts || !posts.length) && !error && !isLoading)
    return "No Post available yet. Try creating one...";

  return (
    <>
      <ErrorModal
        error={error}
        onClear={() => {
          dispatch(clearError());
        }}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid
          className={classes.container}
          container
          alignItems="stretch"
          spacing={3}
        >
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} setCurrentId={setCurrentId} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

export default Posts;
