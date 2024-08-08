import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../../services/graphql/auth";
import Navbar from "../../components/navbar";
import { Nav } from "react-bootstrap";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => navigate("/login"),
    onError: (error) => setValidationError(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "" || email === "") {
      return setValidationError("All fields are required");
    }
    if (password !== rePassword) {
      return setValidationError("Passwords must match");
    }
    setValidationError("");
    registerUser({
      variables: { user: { name, email, password } },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="container-form">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-3">Sign Up</h2>
            {validationError && <p className="error">{validationError}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="toggle-panel-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h3>Already have an account!</h3>
              <Nav.Link
                as={Link}
                to="/login"
                className="fs-5 text-white fw-bold"
                id="register"
              >
                Sign In
              </Nav.Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
