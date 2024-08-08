import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  const isUser = localStorage.getItem("user");
  useEffect(() => {
    if (!isAuthenticated && !isUser) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null; // Render the element only if authenticated
};

export default ProtectedRoute;
