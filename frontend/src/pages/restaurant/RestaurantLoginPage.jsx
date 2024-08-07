import React, { useState } from "react";
import { LOGIN_USER } from "../../services/graphql/auth";
import { useApolloClient, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Nav } from "react-bootstrap";
import { LOGIN_RESTAURANT } from "../../services/graphql/restaurant";

const UserLogin = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [RestaurantLogin] = useMutation(LOGIN_RESTAURANT, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.restaurantLogin.token);
      localStorage.setItem("name", data.restaurantLogin?.user?.name);
      localStorage.setItem("type", data.restaurantLogin?.type);
      if (localStorage.getItem("token") != null) {
        setError("");
        navigate("/dashboard");
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
      await RestaurantLogin({ variables: { restaurant: { email, password } } });
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
              <h2>New Restaurant!</h2>
              <p className="fs-5">Sign Up to be our Partner.</p>
              <Nav.Link
                as={Link}
                to="/restaurant-register"
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
