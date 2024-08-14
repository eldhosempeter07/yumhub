import { Col, Row } from "react-bootstrap";
import CustomChart from "../../components/barChart";
import SideNavbar from "../../components/SideNavbar";
import { GET_RESTAURANT_MONTHLY_ORDERS } from "../../services/graphql/restaurant";
import { useQuery } from "@apollo/client";

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_RESTAURANT_MONTHLY_ORDERS);
  return (
    <Row>
      <Col lg={2} className="bg-dark ">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <div className=" bg-white mt-5 ">
          <h3 className="font-bold text-success text-center uppercase fw-bold ">
            Dashboard
          </h3>
          <div className="flex justify-evenly flex-wrap">
            <CustomChart
              loading={loading}
              error={error}
              data={data?.restaurantMonthlyOrders}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Dashboard;
