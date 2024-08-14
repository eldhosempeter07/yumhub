import { useQuery } from "@apollo/client";
import React from "react";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { RESTAURANT_ORDERS } from "../../services/graphql/restaurant";
import Navbar from "../../components/navbar";
import SideNavbar from "../../components/SideNavbar";
import { useNavigate } from "react-router-dom";
import { ADMIN_ORDERS } from "../../services/graphql/admin";
import AdminSideNav from "../../components/AdminSideNav";

const AdminOrders = () => {
  const { data, loading } = useQuery(ADMIN_ORDERS);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Row>
      <Col lg={2} className="admin-nav">
        <AdminSideNav />
      </Col>
      <Col lg={10}>
        <div className="mx-3">
          <h3 className="text-success text-center uppercase fw-bold mt-4 mb-5">
            Orders
          </h3>
          {data?.adminOrders?.length == 0 ? (
            <div className="d-flex  justify-content-center align-items-center  mb-2">
              <h5 className="fw-bold">No Orders Available</h5>
            </div>
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr className="text-center ">
                  <th className="text-success">User ID</th>
                  <th className="text-success">Ordered Items</th>
                  <th className="text-success">Promo Code</th>
                  <th className="text-success">Delivery Fee</th>
                  <th className="text-success">Tax Amount</th>
                  <th className="text-success">Instructions</th>
                  <th className="text-success">Status</th>
                  {/* <th className="text-success">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.adminOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId}</td>
                    <td>
                      <ul>
                        {order.orderItems.map((item, index) =>
                          item?.items?.map((i) => (
                            <li key={index} style={{ listStyle: "none" }}>
                              <span className="fw-bold">
                                {item?.restaurantName}
                              </span>
                              - {i.count} x {i.name} x ${i.price}
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td>{order.promoCode || "No Promo Code Applied"}</td>

                    <td>$ {order.deliveryFee}</td>
                    <td>$ {order.tax}</td>
                    <td>{order.instructions}</td>
                    <td>
                      {order.orderItems.map((item, index) => (
                        <li key={index} style={{ listStyle: "none" }}>
                          <span className="fw-bold">
                            {item?.restaurantName}
                          </span>
                          - {item?.status}
                          <a
                            className="cart-item-delete cursor-pointer text-success mx-2 "
                            href={`/admin/order/edit/${item?.restaurantId}/${order._id}`}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </a>
                          {/* <span
                            className="cart-item-delete cursor-pointer text-success mx-2"
                            onClick={() =>
                              navigate(
                                `/admin/order/edit/${item?.restaurantId}/${order._id}`
                              )
                            }
                          >
                            <i className="bi bi-pencil-square"></i>{" "}
                          </span> */}
                        </li>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default AdminOrders;
