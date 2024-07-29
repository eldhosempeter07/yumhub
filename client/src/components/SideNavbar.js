import React from "react";
import { Navbar, Nav, NavDropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../utils/Pics/Logo.jpg";

const SideNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("type");
    navigate("/restaurant-login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="flex-md-column">
      <Navbar.Brand as={Link} to="/dashboard">
        <img src={Logo} width={120} height={80} alt="Logo" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="flex-md-column flex-wrap text-center">
          <Nav.Link as={Link} to="/dashboard" className="text-white mb-2 mt-4">
            Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/restaurant-items"
            className="text-white my-2"
          >
            Food Items
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/restaurant-orders"
            className="text-white my-2"
          >
            Orders
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/restaurant-timing"
            className="text-white my-2"
          >
            Timing
          </Nav.Link>

          <DropdownButton drop="up" title="Settings" className=" mt-3">
            <NavDropdown.Item
              as={Link}
              to="/restaurant-profile"
              className="text-dark text-uppercase"
            >
              Profile
            </NavDropdown.Item>
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

export default SideNavbar;
