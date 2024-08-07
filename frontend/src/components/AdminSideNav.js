import React from "react";
import { Navbar, Nav, NavDropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../utils/Pics/Logo.jpg";
import { isTokenExpired } from "../utils/helper";

const AdminSideNav = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("type");
    navigate("/admin/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      className="flex-md-column admin-nav"
    >
      <Navbar.Brand as={Link} to="/admin/dashboard">
        <img src={Logo} width={120} height={80} alt="Logo" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="flex-md-column flex-wrap text-center fw-bold">
          <Nav.Link
            as={Link}
            to="/admin/dashboard"
            className="text-white mb-2 mt-4"
          >
            Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/restaurant"
            className="text-white my-2"
          >
            Restaurants
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/users" className="text-white my-2">
            Users
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/orders" className="text-white my-2">
            Orders
          </Nav.Link>

          <DropdownButton drop="up" title="Settings" className=" mt-3">
            <NavDropdown.Item
              onClick={handleLogout}
              className="text-dark text-uppercase"
            >
              Logout
            </NavDropdown.Item>
          </DropdownButton>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminSideNav;
