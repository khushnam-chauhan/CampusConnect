import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchUser = createAsyncThunk(
  "auth/fetchUser", 
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log(`Fetching user from: ${API_URL}/profile/me`);
      
      try {
        const response = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (prefixError) {
        console.log("Trying without /api prefix");
        const response = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch user" }
      );
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
        localStorage.setItem("token", response.data.token);
        return await thunkAPI.dispatch(fetchUser()).unwrap();
      } catch (prefixError) {
        // If that fails, try without /api prefix
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        localStorage.setItem("token", response.data.token);
        return await thunkAPI.dispatch(fetchUser()).unwrap();
      }
    } catch (error) {
      console.error("Login error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: Boolean(localStorage.getItem("token")),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.token = localStorage.getItem("token");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Fetch user cases
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;