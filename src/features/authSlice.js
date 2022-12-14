import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

const initialState = {
  authData: null,
  isLoading: true,
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.signUp(formData);

      // if (data && data !== {}) {
      localStorage.setItem("Profile", JSON.stringify({ ...data }));
      navigate("/");
      return data;
      // }
    } catch (error) {
      // console.log(error);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.signIn(formData);
      // console.log(data);
      // if (data && data !== {}) {
      localStorage.setItem("Profile", JSON.stringify({ ...data }));
      navigate("/");
      return data;
      // }
    } catch (error) {
      // console.log(error);
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    auth: (state, action) => {
      localStorage.setItem("Profile", JSON.stringify({ ...action?.payload }));
      return {
        ...state,
        authData: action?.payload,
      };
    },
    logout: (state) => {
      return {
        ...state,
        authData: null,
      };
    },
    setError: (state, action) => {
      return {
        ...state,
        error: action?.payload,
      };
    },
    clearError: (state, action) => {
      return {
        ...state,
        error: null,
      };
    },
  },
  extraReducers: {
    [signUp.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [signUp.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        authData: action?.payload,
      };
    },
    [signUp.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action?.payload,
      };
    },
    [signIn.pending]: (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    [signIn.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        authData: action?.payload,
      };
    },
    [signIn.rejected]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action?.payload,
      };
    },
  },
});

export const { auth, logout, clearError, setError } = authSlice.actions;

export default authSlice.reducer;
