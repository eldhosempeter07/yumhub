import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Form, Button, Container, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AdminSideNav from "../../components/AdminSideNav";
import {
  ADMIN_EDIT_ORDER_STATUS,
  ADMIN_RESTAURANT_ORDER_BY_ID,
} from "../../services/graphql/admin";

const AdminEditOrder = () => {
  const { id, resId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  const { data, loading, error } = useQuery(ADMIN_RESTAURANT_ORDER_BY_ID, {
    variables: { id, restaurantId: resId },
  });

  const [adminEditOrderStatus] = useMutation(ADMIN_EDIT_ORDER_STATUS, {
    onCompleted: () => {
      navigate("/admin/orders");
    },
    refetchQueries: [{ query: ADMIN_RESTAURANT_ORDER_BY_ID }],
    onError: (error) => {
      console.error("Error updating order status:", error);
    },
  });

  useEffect(() => {
    if (data) {
      setOrder(data.adminRestaurantOrderById);
      setStatus(data.adminRestaurantOrderById?.orderItems[0]?.status);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    adminEditOrderStatus({
      variables: {
        orderId: id,
        newStatus: status,
        restaurantId: resId,
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
    <Row className="restaurant-row">
      <Col lg={2} className="admin-nav">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <div className="mx-4">
          <h3 className="text-secondary my-4">Edit Order Status</h3>
          <Form onSubmit={handleSubmit} className="w-auto">
            <Form.Group className="my-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                className="w-auto"
                value={order?.userId}
                disabled
              />
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label>Ordered Items</Form.Label>
              <Form.Control
                as="textarea"
                className="w-auto"
                rows={3}
                value={order?.orderItems.map((item) =>
                  item?.items?.map((i) => `${i?.count} x ${i?.name}`)
                )}
                disabled
              />
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label>Subtotal</Form.Label>
              <Form.Control
                type="text"
                className="w-auto"
                value={`$${order?.subTotal}`}
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
                <option value="Pick Up">Pick Up</option>
                <option value="Declined">Declined</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="my-3">
              Update Status
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default AdminEditOrder;
