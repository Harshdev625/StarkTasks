import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask, fetchTasks } from "../redux/taskSlice";
import { fetchUsers } from "../redux/authSlice";
import { toast } from "react-toastify";

const TaskForm = ({ selectedTask, onClose }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    assignedUsers: [],
  });

  useEffect(() => {
    dispatch(fetchUsers());
    if (selectedTask) {
      setFormState({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        assignedUsers: selectedTask.assignedTo.map((user) => user.user._id),
      });
    } else {
      setFormState({
        title: "",
        description: "",
        assignedUsers: [],
      });
    }
  }, [selectedTask, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const taskData = {
      title: formState.title,
      description: formState.description,
      assignedTo: formState.assignedUsers.map((userId) => {
        const existingUser = selectedTask?.assignedTo.find(
          (assigned) => assigned.user._id === userId
        );
        return {
          user: userId,
          completed: existingUser ? existingUser.completed : false,
        };
      }),
    };

    const action = selectedTask
      ? updateTask({ id: selectedTask._id, taskData })
      : createTask(taskData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          selectedTask
            ? "Task updated successfully!"
            : "Task created successfully!"
        );
        dispatch(fetchTasks()); // Fetch all tasks after creating/updating
        onClose();
      })
      .catch(() => {
        toast.error(
          selectedTask ? "Failed to update task." : "Failed to create task."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUserSelection = (userId) => {
    setFormState((prevState) => {
      const assignedUsers = prevState.assignedUsers.includes(userId)
        ? prevState.assignedUsers.filter((id) => id !== userId)
        : [...prevState.assignedUsers, userId];
      return { ...prevState, assignedUsers };
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-md shadow-lg transform transition-all duration-300 scale-95">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          {selectedTask ? "Edit Task" : "Create Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }))
              }
              required
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={formState.description}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
              required
              className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              Assign Users
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-200 p-2 rounded">
              {users.map((user) => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formState.assignedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                    className="mr-2 accent-blue-500"
                  />
                  <span className="text-gray-700">
                    {user.name} - {user.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white font-semibold ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : selectedTask
                ? "Update Task"
                : "Create Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
