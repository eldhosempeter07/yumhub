import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER, USER_INFO } from "../../services/graphql/auth";
import { Button, Form, Spinner } from "react-bootstrap";
import Navbar from "../../components/navbar";

const Profile = () => {
  const { loading, error, data } = useQuery(USER_INFO);
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: USER_INFO }],
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const { name, email, phone } = data.userInfo;

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
      await updateUser({
        variables: {
          user: {
            name: profileData.name || name,
            email: email,
            phone: profileData.phone || phone,
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-4">
        <h3 className="text-center mb-4 text-success fw-bold">Profile</h3>
        <div className="d-flex justify-content-center mx-2">
          <Form style={{ width: "400px" }} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                value={profileData.name || name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Phone"
                value={profileData.phone || phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Profile;
