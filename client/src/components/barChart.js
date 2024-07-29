import { useQuery } from "@apollo/client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GET_RESTAURANT_MONTHLY_ORDERS } from "../services/graphql/restaurant";
import { Spinner } from "react-bootstrap";

const CustomChart = () => {
  const {
    data: monthlyData,
    loading: loadingMonthly,
    error: errorMonthly,
  } = useQuery(GET_RESTAURANT_MONTHLY_ORDERS);
  if (loadingMonthly) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (errorMonthly) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{errorMonthly.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white p-4 ">
      <h4 className="text-center font-semibold mb-10 text-[22px]">
        Monthly orders
      </h4>

      <div className="d-flex justify-content-center">
        <BarChart
          width={1000}
          height={400}
          data={monthlyData?.restaurantMonthlyOrders}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="order" fill="#15803D" name="Orders" />
        </BarChart>
      </div>
    </div>
  );
};

export default CustomChart;
