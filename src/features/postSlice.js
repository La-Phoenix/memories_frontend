import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../api";

// const initialState = {
//   value: [],
// };
const initialState = {
  posts: [],
  isLoading: true,
  error: null,
};

// GENERATES PENDING, FULFILLED AND REJECTED ACTION TYPES
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, dispatch }, { rejectWithValue }) => {
    // return api
    //   .fetchPosts()
    //   .then((response) => console.log(response.data))
    //   .catch((e) => console.log(e));
    try {
      // dispatch(startLoading());
      const { data } = await api.fetchPosts(page);
      // console.log(data);
      // dispatch(endLoading());
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const getPost = createAsyncThunk(
  "posts/getPost",
  async ({ id, dispatch }, { rejectWithValue }) => {
    try {
      // dispatch(startLoading());
      const { data } = await api.getPost(id);
      // dispatch(endLoading());
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const getPostBySearch = createAsyncThunk(
  "posts/getPostBySearch",
  async ({ searchQuery, dispatch }, { rejectWithValue }) => {
    try {
      // if (dispatch) return dispatch(startLoading());

      const { data } = await api.getPostBySearch(searchQuery);
      // console.log(data);
      // if (dispatch) dispatch(endLoading());
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPosts",
  async ({ newPost, dispatch, navigate }, { rejectWithValue }) => {
    try {
      // dispatch(startLoading());
      const { data } = await api.createPosts(newPost);
      navigate(`/posts/${data._id}`);
      // dispatch(endLoading());
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ currentId, postData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.updatePost(currentId, postData);
      navigate(`/posts/${data._id}`);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);
export const likeCountupdate = createAsyncThunk(
  "posts/likePost",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.likeCountupdate(id);

      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ id, dispatch }, { rejectWithValue }) => {
    try {
      // dispatch(startLoading());
      await api.deletePost(id);
      // dispatch(endLoading());
      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ finalComment, id }, { rejectWithValue }) => {
    try {
      const { data } = await api.commentPost(finalComment, id);
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state, action) => {
      return {
        ...state,
        error: null,
      };
    },
    // startLoading: (state, action) => {
    //   return {
    //     ...state,
    //     isLoading: true,
    //   };
    // },
    // endLoading: (state, action) => {
    //   return {
    //     ...state,
    //     isLoading: false,
    //   };
    // },
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [fetchPosts.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    },
    [fetchPosts.rejected]: (state, action) => {
      console.log(action);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
    [getPost.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [getPost.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        post: action.payload,
      };
    },
    [getPost.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
    [createPost.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [createPost.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: [...state.posts, action.payload],
      };
    },
    [createPost.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
    // [updatePost.pending]: (state, action) => {
    //   return {
    //     ...state,
    //     isLoading: true

    //   };
    // },
    [updatePost.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,

        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    },
    [updatePost.rejected]: (state, action) => {
      return {
        ...state,
        error: action.payload,
      };
    },
    // [likeCountupdate.pending]: (state, action) => {
    //   return {
    //     ...state,
    //     isLoading: true
    //   };
    // },
    [likeCountupdate.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    },

    [commentPost.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [commentPost.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: state.posts.map((p) => {
          if (p._id === action.payload._id) return action.payload;
          return p;
        }),
      };
    },
    [commentPost.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
    [deletePost.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [deletePost.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    },
    [deletePost.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },

    [getPostBySearch.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        posts: action.payload,
      };
    },
    [getPostBySearch.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    },
  },
});

export const { clearError } = postsSlice.actions;

export default postsSlice.reducer;

// extraReducers: (builder) => {
//     builder.addCase(fetchPosts.pending, (state) => {});
//     builder.addCase(fetchPosts.fulfilled, (state, action) => {
//       // console.log(action);
//       // return state.posts = action.payload;
//       return {
//         ...state,
//         posts: action.payload,
//       };
//     });
//     builder.addCase(fetchPosts.rejected, (state, action) => {});
//   },
