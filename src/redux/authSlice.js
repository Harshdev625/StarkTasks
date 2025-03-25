import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// axios.defaults.baseURL = "http://localhost:5000";

export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (id, { getState, rejectWithValue }) => {
    const {
      auth: { token },
    } = getState();
    try {
      const response = await axios.get(`/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user.");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { token },
    } = getState();
    try {
      const response = await axios.get("/api/admin/fetchallusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users.");
    }
  }
);

const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  role: null,
  loading: false,
  error: null,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;
      localStorage.setItem("token", token);

      try {
        const decodedToken = jwtDecode(token);
        state.user = decodedToken.id;
        state.role = decodedToken.role;
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      state.users = [];
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;