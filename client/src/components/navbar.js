import React, { useEffect } from "react";
import { Navbar as BootstrapNavbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CART } from "../services/graphql/auth";
import Logo from "../utils/Pics/Logo.jpg";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const { data, refetch } = useQuery(CART);
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("type");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (data?.cart?.userId == null) {
      refetch();
    }
  }, [data?.cart?.userId, refetch]);

  return (
    <BootstrapNavbar collapseOnSelect expand="lg" className="yum_nav py-1">
      <BootstrapNavbar.Brand className="text-white fw-bold" as={Link} to="/">
        <img src={Logo} width={100} height={80} alt="Logo" />
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BootstrapNavbar.Collapse
        id="responsive-navbar-nav"
        className="justify-content-end yum-nav"
      >
        <Nav className="fw-bold">
          <Nav.Link
            className="text-white text-uppercase"
            as={Link}
            to="/restaurants"
          >
            Restaurants
          </Nav.Link>

          {isAuthenticated && type === "user" ? (
            <>
              <NavDropdown
                title={localStorage.getItem("name").slice(0, 1)}
                id="navbarScrollingDropdown"
                className="text-uppercase"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/profile"
                  className="text-center"
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/favourites"
                  className="text-center"
                >
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/address"
                  className="text-center"
                >
                  Address
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/orders"
                  className="text-center"
                >
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-center"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className="text-white cart" as={Link} to="/cart">
                <i className="bi bi-cart"></i>
                <span className="cart-item-count">
                  {data?.cart?.totalCount || 0}
                </span>
              </Nav.Link>
            </>
          ) : (
            <Nav.Link
              className="text-white text-uppercase"
              as={Link}
              to="/login"
            >
              Login
            </Nav.Link>
          )}

          <NavDropdown title="Business" className="text-uppercase">
            <NavDropdown.Item
              className="text-uppercase"
              as={Link}
              to="/restaurant-login"
            >
              Login
            </NavDropdown.Item>
            <NavDropdown.Item
              className="text-uppercase"
              as={Link}
              to="/restaurant-register"
            >
              Signup
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
