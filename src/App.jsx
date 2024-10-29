import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken, fetchUserById, logout } from "./redux/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashBoard from "./pages/UserDashBoard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const userFetched = useSelector((state) => !!state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !token) {
      dispatch(setToken(localToken));
    }

    if (token && !userFetched) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken?.id) {
          dispatch(fetchUserById(decodedToken.id));
        }
      } catch (error) {
        console.error("Token error:", error);
        dispatch(logout());
      }
    }

    Modal.setAppElement("#root");
  }, [token, userFetched, dispatch]);

  const renderDashboard = () => {
    if (loading) return null;
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "user") return <Navigate to="/user/dashboard" replace />;
    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={token ? renderDashboard() : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={!token ? <Login /> : renderDashboard()} />
        <Route
          path="/register"
          element={!token ? <Register /> : renderDashboard()}
        />
        <Route
          path="/user/dashboard"
          element={
            role === "user" ? <UserDashBoard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            role === "admin" ? <AdminDashboard /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
