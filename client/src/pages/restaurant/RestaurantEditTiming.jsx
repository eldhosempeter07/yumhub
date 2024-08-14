import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  GET_RESTAURANT_TIMING,
  UPDATE_RESTAURANT_TIMING,
  GET_RESTAURANT_TIMINGS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RestaurantEditTiming = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_RESTAURANT_TIMING, {
    variables: { id },
  });
  const [updateRestaurantTiming] = useMutation(UPDATE_RESTAURANT_TIMING, {
    onCompleted: () => {
      navigate("/restaurant-timing");
    },
    refetchQueries: [{ query: GET_RESTAURANT_TIMINGS }],
  });

  const [timing, setTiming] = useState({
    day: "",
    start: "",
    end: "",
    holiday: false,
  });

  useEffect(() => {
    if (data) {
      setTiming({
        day: data.getRestaurantTiming.day,
        start: data.getRestaurantTiming.start,
        end: data.getRestaurantTiming.end,
        holiday: data.getRestaurantTiming.holiday,
      });
    }
  }, [data]);

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
      await updateRestaurantTiming({
        variables: {
          timing: {
            id,
            ...timing,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Row>
      <Col lg={2} className="bg-dark">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h3 className="text-secondary my-4 mx-2">Edit Timing</h3>

            <Form onSubmit={handleSubmit} className="mx-2">
              <Form.Group className="my-3" controlId="formDay">
                <Form.Label>Day</Form.Label>
                <Form.Control
                  as="select"
                  name="day"
                  value={timing?.day}
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
                  value={timing?.start}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formEnd">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="end"
                  value={timing?.end}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formHoliday">
                <Form.Check
                  type="checkbox"
                  name="holiday"
                  label="Holiday"
                  checked={timing?.holiday}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="my-3">
                Update Timing
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RestaurantEditTiming;
