import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RootRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const type = localStorage.getItem("type");
  useEffect(() => {
    if (isAuthenticated) {
      if (type == "admin") {
        return navigate("/admin/dashboard");
      } else if (type == "business") {
        return navigate("/dashboard");
      } else {
        return navigate("/");
      }
    } else {
      return navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : element;
};

export default RootRoute;
