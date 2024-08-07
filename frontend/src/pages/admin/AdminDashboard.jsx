// import PieCustomChart from "../../components/piChart";

import { Col, Row } from "react-bootstrap";
import CustomChart from "../../components/barChart";
import AdminSideNav from "../../components/AdminSideNav";
import { ADMIN_MONTHLY_ORDERS } from "../../services/graphql/admin";
import { useQuery } from "@apollo/client";

const AdminDashboard = () => {
  const { data, loading, error } = useQuery(ADMIN_MONTHLY_ORDERS);

  return (
    <Row className="restaurant-row">
      <Col lg={2} className="admin-nav ">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <div className=" bg-white mt-5 ">
          <h3 className="font-bold text-success text-center uppercase fw-bold ">
            Admin Dashboard
          </h3>
          <div className="flex justify-evenly flex-wrap">
            {/* <PieCustomChart /> */}
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
