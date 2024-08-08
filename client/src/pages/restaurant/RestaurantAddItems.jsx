import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import SideNavbar from "../../components/SideNavbar";
import { useNavigate } from "react-router-dom";
import {
  ADD_FOOD_ITEM,
  RESTAURANT_ITEMS,
} from "../../services/graphql/restaurant";
import { getBackendUrl } from "../../utils/helper";

const types = [
  { id: 1, name: "Indian" },
  { id: 4, name: "Fast Food" },
  { id: 5, name: "Thai" },
  { id: 6, name: "Mexican" },
];

const RestaurantAddItems = () => {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    imageURL: "",
    rating: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("Indian");

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [image, setImage] = useState(null);

  const [addFoodItem] = useMutation(ADD_FOOD_ITEM, {
    onCompleted: () => {
      if (image != null) handleImageChange(image);
    },
    refetchQueries: [{ query: RESTAURANT_ITEMS }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({
      ...item,
      [name]: value,
    });
  };

  const handleImageChange = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const backendUrl = getBackendUrl();
    try {
      const response = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data) {
        navigate("/restaurant-items");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFoodItem({
        variables: {
          menuItem: {
            ...item,
            category: selectedCategory,
            imageURL: image.name,
            price: parseFloat(item.price),
          },
        },
      });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row className="restaurant-row">
      <Col lg={2} className="bg-dark">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h3 className="text-secondary my-4 mx-2">Add Food Item</h3>
            {showAlert && (
              <Alert variant="success">Food item added successfully!</Alert>
            )}
            <Form className="mx-2" onSubmit={handleSubmit}>
              <Form.Group className="my-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  value={selectedCategory}
                  required
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="my-3" controlId="formImageURL">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="my-3">
                Add Food Item
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RestaurantAddItems;
