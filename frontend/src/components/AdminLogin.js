import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Container>
      <div className="container-form">
        <Form onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </Form>
      </div>

      <div className="toggle-panel-container">
        <div className="toggle">
          <div className="toggle-panel toggle-right">
            <h1>New Customer!</h1>
            <p>Sign Up to get delicious treat.</p>
            <Button variant="secondary" id="register">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminLogin;
