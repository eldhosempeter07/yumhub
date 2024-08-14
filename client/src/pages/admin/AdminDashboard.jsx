import { useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import CustomChart from "../../components/barChart";
import AdminSideNav from "../../components/AdminSideNav";
import { ADMIN_MONTHLY_ORDERS } from "../../services/graphql/admin";
import { useQuery } from "@apollo/client";

const AdminDashboard = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = monthNames[new Date().getMonth()];

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { data, loading, error, refetch } = useQuery(ADMIN_MONTHLY_ORDERS, {
    variables: { monthName: selectedMonth },
  });

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    refetch({ monthName: e.target.value });
  };

  return (
    <Row>
      <Col lg={2} className="admin-nav admin-height">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <div className="bg-white mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="font-bold text-success text-center uppercase fw-bold">
              Admin Dashboard
            </h3>
            <Form.Select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-25"
            >
              {monthNames.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="flex justify-evenly flex-wrap">
            <CustomChart
              loading={loading}
              error={error}
              data={data?.adminMonthlyOrders}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
