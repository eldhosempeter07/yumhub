import React, { useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { ADMIN_LOGIN } from "../../services/graphql/admin";

const AdminLogin = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [adminLogin] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.adminLogin.token);
      localStorage.setItem("name", data.adminLogin?.user?.name);
      localStorage.setItem("type", data.adminLogin?.type);
      if (localStorage.getItem("token") != null) {
        setError("");
        navigate("/admin/dashboard");
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    client.resetStore();
    try {
      await adminLogin({ variables: { user: { email, password } } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="container-form">
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            {error !== "" ? (
              <p className="text-danger fw-bold text-center">{error}</p>
            ) : null}
            <button className=" fw-bold">Sign In</button>
          </form>
        </div>
        <div className="toggle-panel-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h2>Admin Login</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
