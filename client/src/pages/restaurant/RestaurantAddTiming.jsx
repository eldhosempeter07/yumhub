import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import {
  ADD_RESTAURANT_TIMING,
  GET_RESTAURANT_TIMINGS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RestaurantAddTiming = () => {
  const [timing, setTiming] = useState({
    day: "",
    start: "",
    end: "",
    holiday: false,
  });
  const navigate = useNavigate();
  const [addRestaurantTiming] = useMutation(ADD_RESTAURANT_TIMING, {
    onCompleted: () => {
      navigate("/restaurant-timing");
    },
    refetchQueries: [{ query: GET_RESTAURANT_TIMINGS }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTiming({
      ...timing,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRestaurantTiming({
        variables: {
          timing,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col lg={2} className="bg-dark">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h3 className="text-secondary my-4 mx-2">Add Timing</h3>

            <Form onSubmit={handleSubmit} className="mx-2 time-form">
              <Form.Group className="my-3" controlId="formDay">
                <Form.Label>Day</Form.Label>
                <Form.Control
                  as="select"
                  name="day"
                  value={timing.day}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a day
                  </option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="my-3" controlId="formStart">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start"
                  value={timing.start}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formEnd">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="end"
                  value={timing.end}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formHoliday">
                <Form.Check
                  type="checkbox"
                  name="holiday"
                  label="Holiday"
                  checked={timing.holiday}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="my-3">
                Add Timing
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RestaurantAddTiming;
