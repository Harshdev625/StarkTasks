import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, completeTask } from "../redux/taskSlice";
import { toast } from "react-toastify";

const UserDashBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const userId = useSelector((state) => state.auth.user._id);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleComplete = (taskId) => {
    dispatch(completeTask(taskId))
      .unwrap()
      .then(() => {
        dispatch(fetchTasks());
        toast.success("Task marked as complete!");
      })
      .catch((err) => {
        console.error("Failed to complete the task:", err);
        toast.error("Failed to mark task as complete.");
      });
  };

  if (loading) {
    return <p className="text-gray-600">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-4">Your Tasks</h2>

      <ul className="mt-4 space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            // Find the assigned user object for the logged-in user
            const assignedUser = task.assignedTo.find(
              (user) => user.user._id === userId
            );
            const isCompleted = assignedUser ? assignedUser.completed : false; // Check if the logged-in user has completed the task

            return (
              <li
                key={task._id}
                className="p-6 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition duration-200"
              >
                <h3 className="text-xl font-semibold text-blue-600">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Description: {task.description}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Assigned To:{" "}
                  {task.assignedTo.map((user) => user.user.username).join(", ")}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isCompleted ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  Your Status: {isCompleted ? "Completed" : "Pending"}
                </p>

                {!isCompleted && (
                  <button
                    onClick={() => handleComplete(task._id)} // Complete button to mark task as complete
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition duration-200"
                  >
                    Mark as Complete
                  </button>
                )}
              </li>
            );
          })
        ) : (
          <p className="text-gray-600">No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default UserDashBoard;
