import React, { useState, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  ADD_FOOD_ITEM,
  EDIT_FOOD_ITEM,
  RESTAURANT_ITEM_BY_ID,
  RESTAURANT_ITEMS,
  RESTAURANT_ORDERS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { getBackendUrl } from "../../utils/helper";

const RestaurantEditItem = () => {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageURL: "",
    rating: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const { data, loading, error } = useQuery(RESTAURANT_ITEM_BY_ID, {
    variables: { id },
  });

  const [editFoodItem, { loading: mutationLoading, error: mutationError }] =
    useMutation(EDIT_FOOD_ITEM, {
      onCompleted: () => {
        if (image) handleImageChange(image);
        else navigate("/restaurant-items");
      },
      refetchQueries: [{ query: RESTAURANT_ORDERS }],
    });

  useEffect(() => {
    if (data) {
      setItem({
        name: data.restaurantItemById.name,
        description: data.restaurantItemById.description,
        price: data.restaurantItemById.price,
        category: data.restaurantItemById.category,
        imageURL: data.restaurantItemById.imageURL,
        rating: data.restaurantItemById.rating,
      });
    }
  }, [data]);

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
      navigate("/restaurant-items");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editFoodItem({
        variables: {
          menuItem: {
            ...item,
            imageURL: image ? image.name : data?.restaurantItemById?.imageURL,
            price: parseFloat(item.price),
          },
        },
      });
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  return (
    <Row>
      <Col lg={2} className="bg-dark">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h3 className="text-secondary my-4 mx-2">Edit Food Item</h3>
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
                <Form.Control
                  type="text"
                  name="category"
                  value={item.category}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group
                className="my-3 item-image-form"
                controlId="formImageURL"
              >
                <Form.Label>Image</Form.Label>
                <Form.Control
                  className={`${image == null ? "text-white" : "text-dark"}`}
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {image == null ? (
                  <span className="item-image-name">
                    {data.restaurantItemById.imageURL}
                  </span>
                ) : null}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="my-3"
                disabled={mutationLoading}
              >
                {mutationLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Update Food Item"
                )}
              </Button>
              {mutationError && (
                <Alert variant="danger">Error: {mutationError.message}</Alert>
              )}
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RestaurantEditItem;
