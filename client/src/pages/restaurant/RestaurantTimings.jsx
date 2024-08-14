import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import {
  DELETE_FOOD_ITEM,
  DELETE_RESTAURANT_TIMING,
  GET_RESTAURANT_TIMINGS,
  RESTAURANT_ITEMS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { convertTo12Hour } from "../../utils/helper";

const RestaurantTimings = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_RESTAURANT_TIMINGS);
  const [deleteRestaurantTiming] = useMutation(DELETE_RESTAURANT_TIMING, {
    refetchQueries: [{ query: GET_RESTAURANT_TIMINGS }],
  });
  return (
    <Row>
      <Col lg={2} className="bg-dark admin-height">
        <SideNavbar />
      </Col>
      <Col lg={8} className="">
        <div className="text-end mt-3">
          <Link to="/add-timing" className="btn text-white">
            Add New
          </Link>
        </div>
        <h3 className="font-bold text-success text-center uppercase fw-bold mt-4 mb-5">
          Timing
        </h3>
        {data?.getRestaurantTimings?.length == 0 ? (
          <div className="d-flex  justify-content-center align-items-center  mb-2">
            <h5 className="fw-bold">Timing is not added</h5>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="">
              <tr className="text-center bg-dark">
                <th className="text-success w-50">Day</th>
                <th className="text-success w-50">Start</th>
                <th className="text-success w-50">End</th>
                <th className="text-success w-50">Holiday</th>
                <th className="text-success w-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.getRestaurantTimings.map((item) => (
                <tr key={item?.id}>
                  <td>{item?.day}</td>
                  <td className="w-50">
                    {item?.start ? convertTo12Hour(item?.start) : null}
                  </td>
                  <td className="w-50">
                    {item?.start ? convertTo12Hour(item?.end) : null}
                  </td>
                  <td className="w-50"> {item?.holiday ? "Yes" : "No"}</td>
                  <td className="w-50">
                    <span
                      className="cart-item-delete cursor-pointer text-success"
                      onClick={() => navigate(`/restaurant-timing/${item?.id}`)}
                    >
                      <i className="bi bi-pencil-square"></i>{" "}
                    </span>
                    <span
                      className="cart-item-delete mx-2 cursor-pointer text-danger"
                      onClick={() =>
                        deleteRestaurantTiming({ variables: { id: item?.id } })
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

export default RestaurantTimings;
