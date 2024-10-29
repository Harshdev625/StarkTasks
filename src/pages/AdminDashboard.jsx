import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask } from "../redux/taskSlice";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedTask(null);
    setShowForm(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteTask(taskToDelete));
      toast.success("Task deleted successfully.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      <button
        onClick={() => {
          setShowForm(true);
          setSelectedTask(null);
        }}
        className="mb-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition duration-200 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
      >
        + Create New Task
      </button>

      {showForm && (
        <TaskForm selectedTask={selectedTask} onClose={handleFormClose} />
      )}

      {loading && <p className="text-lg text-gray-600">Loading tasks...</p>}
      {error && <p className="text-lg text-red-600">{error}</p>}

      <ul className="mt-4 space-y-4 w-full max-w-4xl">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-200 flex flex-col"
          >
            <a
              href={`/tasks/${task._id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {task.title}
            </a>
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            <p className="mt-2 font-semibold">Overall Status: {task.status}</p>

            <div className="mt-2">
              <h3 className="font-semibold">Assigned Users:</h3>
              <ul className="space-y-1">
                {task.assignedTo.map((assignedUser, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {assignedUser.user.username} ({assignedUser.user.email})
                    </span>
                    <span
                      className={`font-semibold ${
                        assignedUser.completed
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {assignedUser.completed ? "Completed" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(task)}
                className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600 w-1/2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(task._id)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 w-1/2 ml-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-md max-w-xs w-full md:max-w-sm lg:max-w-md">
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this task?</p>
          <div className="flex justify-between">
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-5/12"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 w-5/12"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
