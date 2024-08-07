import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import {
  DELETE_FOOD_ITEM,
  DELETE_RESTAURANT_TIMING,
  GET_RESTAURANT_TIMINGS,
  RESTAURANT_ITEMS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { convertTo12Hour } from "../../utils/helper";
import {
  ADMIN_DELETE_RESTAURANT,
  RESTAURANTS,
} from "../../services/graphql/admin";
import AdminSideNav from "../../components/AdminSideNav";

const AdminRestaurant = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(RESTAURANTS);
  const [adminDeleteRestaurant] = useMutation(ADMIN_DELETE_RESTAURANT, {
    refetchQueries: [{ query: RESTAURANTS }],
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Row className="restaurant-row">
      <Col lg={2} className="admin-nav">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <h3 className="font-bold text-success text-center uppercase fw-bold mt-4 mb-5">
          Restaurants
        </h3>
        {data?.restaurants?.length == 0 ? (
          <div className="d-flex  justify-content-center align-items-center  mb-2">
            <h5 className="fw-bold">No Restaurants Added</h5>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="">
              <tr className="text-center bg-dark">
                <th className="text-success">Name</th>
                <th className="text-success">Phone</th>
                <th className="text-success">Location</th>
                <th className="text-success">Status</th>
                <th className="text-success">Email</th>
              </tr>
            </thead>
            <tbody>
              {data?.restaurants.map((item) => (
                <tr key={item?.id}>
                  <td className="w-50">{item?.name}</td>
                  <td className="w-50">{item?.phone}</td>
                  <td className="w-50"> {item?.location}</td>
                  <td className="w-50"> {item?.status}</td>
                  <td className="w-50"> {item?.email}</td>
                  <td className="d-flex">
                    <a
                      className="cart-item-delete cursor-pointer text-success"
                      href={`/admin/restaurant/edit/${item?.id}`}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </a>
                    <span
                      className="cart-item-delete mx-2 cursor-pointer text-danger mx-3"
                      onClick={() =>
                        adminDeleteRestaurant({ variables: { id: item?.id } })
                      }
                    >
                      <i class="bi bi-trash3-fill"></i>{" "}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default AdminRestaurant;
