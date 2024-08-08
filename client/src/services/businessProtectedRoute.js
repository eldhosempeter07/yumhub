import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BusinessProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
  const isBusiness = localStorage.getItem("business");
  useEffect(() => {
    if (!isAuthenticated && !isBusiness) {
      navigate("/restaurant-login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null; // Render the element only if authenticated
};

export default BusinessProtectedRoute;
