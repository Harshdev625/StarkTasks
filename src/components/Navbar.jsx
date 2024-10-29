import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Task Manager</h1>
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Logout
            </button>
          ) : (
            <div>
              <Link to="/login" className="text-white px-4 hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-white px-4 hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
