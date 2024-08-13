import React, { useState } from "react";
import { LOGIN_USER } from "../../services/graphql/auth";
import { useApolloClient, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Nav } from "react-bootstrap";

const UserLogin = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.loginUser?.message?.includes("Your Account Status")) {
        return setError(data.loginUser?.message);
      }
      localStorage.setItem("token", data.loginUser.token);
      localStorage.setItem("name", data.loginUser?.user?.name);
      localStorage.setItem("type", data.loginUser?.type);
      if (localStorage.getItem("token") != null) {
        setError("");
        navigate("/");
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
      await loginUser({ variables: { user: { email, password } } });
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
              <h2>New Customer!</h2>
              <p className="fs-5">Sign Up to get delicious treat.</p>
              <Nav.Link
                as={Link}
                to="/register"
                className="fs-5 text-white fw-bold"
                id="register"
              >
                Sign Up
              </Nav.Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
