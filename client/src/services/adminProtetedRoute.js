import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const isUser = localStorage.getItem("admin");
  useEffect(() => {
    if (!isAuthenticated && !isUser) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null;
};

export default AdminProtectedRoute;
