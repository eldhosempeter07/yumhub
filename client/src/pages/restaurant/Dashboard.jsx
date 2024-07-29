// import PieCustomChart from "../../components/piChart";

import { Col, Row } from "react-bootstrap";
import CustomChart from "../../components/barChart";
import SideNavbar from "../../components/SideNavbar";

const Dashboard = () => {
  return (
    <Row className="restaurant-row">
      <Col lg={2} className="bg-dark ">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <div className=" bg-white mt-5 ">
          <h3 className="font-bold text-success text-center uppercase fw-bold ">
            Dashboard
          </h3>
          <div className="flex justify-evenly flex-wrap">
            {/* <PieCustomChart /> */}
            <CustomChart />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Dashboard;
