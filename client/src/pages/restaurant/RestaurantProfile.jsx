import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import SideNavbar from "../../components/SideNavbar";
import { getBackendUrl, getImageUrl } from "../../utils/helper";
import {
  RESTAURANT_INFO,
  UPDATE_RESTAURANT,
} from "../../services/graphql/restaurant";

const RestaurantProfile = () => {
  const { loading, error, data } = useQuery(RESTAURANT_INFO);
  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT, {
    refetchQueries: [{ query: RESTAURANT_INFO }],
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    type: "",
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fireStoreImage, setFireStoreImage] = useState(null);

  useEffect(() => {
    if (!loading && data && data.restaurantInfo) {
      const { name, email, phone, location, type } = data.restaurantInfo;
      setProfileData({ name, email, phone, location, type });

      if (data.restaurantInfo.image) {
        fetchImageUrl(
          `gs://yumhub-d8edd.appspot.com/${data.restaurantInfo.image}`
        );
      }
    }
  }, [loading, data]);

  const fetchImageUrl = async (imageUrl) => {
    try {
      const url = await getImageUrl(imageUrl);
      setFireStoreImage(url);
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRestaurant({
        variables: {
          user: {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            location: profileData.location,
            type: profileData.type,
            image: imageName ? imageName.name : null,
          },
        },
      });

      if (imageName) {
        handleImageChange(imageName);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setImageName(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
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
    } catch (error) {
      console.error("Error uploading image:", error);
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
    <Row className="restaurant-row">
      <Col lg={2} className="bg-dark">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <div className="mt-4 mx-5">
          <h3 className="text-center mb-4 text-success fw-bold">Profile</h3>
          <div className="d-flex justify-content-center">
            <Form style={{ width: "400px" }} onSubmit={handleSubmit}>
              <Form.Group
                className="my-3 position-relative"
                controlId="formImageURL"
              >
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="text-white profile-upload"
                />

                <div className="text-center">
                  <img
                    src={
                      image !== null
                        ? image
                        : fireStoreImage
                        ? fireStoreImage
                        : require("../../utils/Pics/user.jpg")
                    }
                    alt="Uploaded"
                    style={{ maxWidth: "50%" }}
                    className="rounded-circle"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={profileData.email}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={profileData.location}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={profileData.type}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RestaurantProfile;
