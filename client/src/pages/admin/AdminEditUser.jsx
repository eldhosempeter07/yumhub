import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER, USER_INFO } from "../../services/graphql/auth";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Navbar from "../../components/navbar";
import {
  ADMIN_EDIT_USER,
  ADMIN_USER_INFO,
  USERS,
} from "../../services/graphql/admin";
import { useNavigate, useParams } from "react-router-dom";
import AdminSideNav from "../../components/AdminSideNav";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { loading, error, data } = useQuery(ADMIN_USER_INFO, {
    variables: { id },
    onCompleted: (data) => {
      if (data?.adminUserInfo) {
        setStatus(data?.adminUserInfo?.status);
      }
    },
  });

  console.log(status);

  const [adminEditUser] = useMutation(ADMIN_EDIT_USER, {
    refetchQueries: [{ query: USERS }],
    onCompleted: () => navigate("/admin/users"),
  });
  const [AdminEditUserData, setAdminEditUserData] = useState({
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

  const { name, email, phone } = data.adminUserInfo;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminEditUser({
        variables: {
          newStatus: status,
          userId: id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Row className="restaurant-row">
      <Col lg={2} className="admin-nav">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <div className="mt-4">
          <h3 className="text-center mb-4 text-success fw-bold">User</h3>
          <div className="d-flex justify-content-center mx-2">
            <Form style={{ width: "400px" }} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={AdminEditUserData.name || name}
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
                  value={AdminEditUserData.phone || phone}
                  onChange={handleChange}
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

export default AdminEditUser;
