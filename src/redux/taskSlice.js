// src/redux/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all tasks for the logged-in user
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    // console.log("Fetching tasks with token:", token);

    try {
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Fetched tasks response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error fetching tasks:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch tasks.");
    }
  }
);

// Fetch a single task by ID
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (taskId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Fetched task by ID response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error fetching task by ID:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch task.");
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post("/api/admin/tasks/", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Created task response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error creating task:", error);
      return rejectWithValue(error.response?.data || "Failed to create task.");
    }
  }
);

// Update an existing task (using PATCH)
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    // console.log("Updating task ID:", id, "with data:", taskData);
    try {
      const response = await axios.patch(`/api/admin/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Updated task response:", response.data);
      return response.data; // Return the updated task
    } catch (error) {
      // console.error("Error updating task:", error);
      return rejectWithValue(error.response?.data || "Failed to update task.");
    }
  }
);

// Mark a task as completed
export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (taskId, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    dispatch(updateTaskState(taskId));

    // console.log("Completing task ID:", taskId);
    try {
      const response = await axios.patch(
        `/api/tasks/${taskId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("Completed task response:", response.data);
      return response.data;
    } catch (error) {
      // console.error("Error marking task as completed:", error);
      return rejectWithValue(
        error.response?.data || "Failed to mark task as completed."
      );
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    // console.log("Deleting task ID:", taskId);
    try {
      await axios.delete(`/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Deleted task ID:", taskId);
      return { _id: taskId };
    } catch (error) {
      // console.error("Error deleting task:", error);
      return rejectWithValue(error.response?.data || "Failed to delete task.");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    selectedTask: null, // Manage selected task state
  },
  reducers: {
    updateTaskState: (state, action) => {
      const taskId = action.payload;
      const task = state.tasks.find((task) => task._id === taskId);
      if (task) {
        // console.log("Optimistically updating task ID:", taskId);
        task.status = "completed";
        task.completed = true;
      }
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        // console.log("Tasks fetched:", action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Error fetching tasks:", action.payload);
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
        // console.log("Selected task fetched:", action.payload);
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Error fetching task by ID:", action.payload);
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // Add new task to the state
        // console.log("Task created:", action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Error creating task:", action.payload);
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
          // console.log("Task updated:", action.payload);
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Error updating task:", action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
          // console.log("Task completed:", action.payload);
        }
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload._id
        );
        // console.log("Task deleted:", action.payload._id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.error("Error deleting task:", action.payload);
      });
  },
});

export const { updateTaskState, setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
