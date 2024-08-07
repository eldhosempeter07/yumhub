import React, { useState } from "react";

const RestaurantSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="container-form">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="toggle-panel-container">
        <div className="toggle">
          <div className="toggle-panel toggle-right">
            <h1>New Restaurant!</h1>
            <p>Sign Up to be our Partner.</p>
            <button className="hidden" id="register">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignUp;
