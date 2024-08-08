import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";

const Confirmation = () => {
  return (
    <>
      <Navbar />
      <div className="mt-5">
        <Row className="vw-100">
          <Col xs={12} className="text-center mt-5 ">
            <h2 className="text-success">Thank you for your order!</h2>
            <p className="my-4">
              Your food order has been successfully processed.
            </p>
            <p>We will deliver it to you shortly.</p>
            <Button as={Link} to="/" variant="primary" className="mt-3">
              Back to Home
            </Button>
            <Button
              as={Link}
              to="/orders"
              variant="primary"
              className="mt-3 mx-3"
            >
              View Orders
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Confirmation;
