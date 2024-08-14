import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import SideNavbar from "../../components/SideNavbar";
import { getImageUrl } from "../../utils/helper";
import {
  RESTAURANT_INFO,
  UPDATE_RESTAURANT,
} from "../../services/graphql/restaurant";
import {
  ADMIN_EDIT_RESTAURANT_STATUS,
  ADMIN_RESTAURANT_BY_ID,
  ADMIN_RESTAURANT_INFO,
  RESTAURANTS,
} from "../../services/graphql/admin";
import { useNavigate, useParams } from "react-router-dom";
import AdminSideNav from "../../components/AdminSideNav";

const AdminEditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(ADMIN_RESTAURANT_INFO, {
    variables: { id: id },
  });
  const [adminEditRestaurantStatus] = useMutation(
    ADMIN_EDIT_RESTAURANT_STATUS,
    {
      onCompleted: () => navigate("/admin/restaurant"),
      refetchQueries: [{ query: RESTAURANTS }],
    }
  );

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    type: "",
  });

  const [fireStoreImage, setFireStoreImage] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loading && data && data.adminRestaurantInfo) {
      const { name, email, phone, location, type, status } =
        data.adminRestaurantInfo;
      setProfileData({ name, email, phone, location, type, status });
      setStatus(status);
      if (data.adminRestaurantInfo.image) {
        fetchImageUrl(
          `gs://yumhub-d8edd.appspot.com/${data.adminRestaurantInfo.image}`
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

  const handleSubmit = (e) => {
    e.preventDefault();
    adminEditRestaurantStatus({
      variables: {
        restaurantId: id,
        newStatus: status,
      },
    });
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
      <Col lg={2} className="admin-nav">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <div className="mt-4 mx-5">
          <h3 className="text-center mb-4 text-success fw-bold">
            {profileData.name}
          </h3>
          <div className="d-flex justify-content-center">
            <Form style={{ width: "400px" }} onSubmit={handleSubmit}>
              <Form.Group
                className="my-3 position-relative"
                controlId="formImageURL"
              >
                <div className="text-center">
                  <img
                    src={
                      fireStoreImage
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
                  disabled
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
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={profileData.location}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  placeholder="Type"
                  value={profileData.type}
                  disabled
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  className="w-auto"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approve</option>
                  <option value="Blocked">Block</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit" className="mb-3">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AdminEditRestaurant;
