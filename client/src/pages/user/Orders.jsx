import React from "react";
import { useQuery } from "@apollo/client";
import { ORDERS } from "../../services/graphql/auth";
import Navbar from "../../components/navbar";
import OrderCard from "../../components/OrderCard";
import { Spinner } from "react-bootstrap";
const Orders = () => {
  const { data, loading } = useQuery(ORDERS);
  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <h3 className="text-center my-4 fw-bold cart-item-name text-success fs-3">
            Orders
          </h3>

          {data?.orders?.length > 0 ? (
            data?.orders?.map((res) => <OrderCard order={res} />)
          ) : (
            <div className="text-center order-width">
              <div className="d-flex justify-content-center align-items-center fw-bold mb-2">
                <h5>No Orders</h5>
              </div>
              <a href="/restaurants" className="text-success fw-bold">
                Go Back To Restaurants
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
