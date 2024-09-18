import React, { useEffect, useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Button,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CART, GET_NOTIFICATIONS } from "../services/graphql/auth";
import Logo from "../utils/Pics/Logo.jpg";
import { formatTimestamp, isTokenExpired } from "../utils/helper";
import { Form } from "react-bootstrap";

const FlavorFleetNavbar = (homeProps) => {
  console.log(homeProps);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);
  const isAuthenticated = !!localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const userId = localStorage.getItem("userId");
  const { data: cartData, refetch: refetchCart } = useQuery(CART);
  const { data: notificationsData, refetch: refetchNotifications } = useQuery(
    GET_NOTIFICATIONS,
    {
      skip: !isAuthenticated,
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      refetchNotifications();
      refetchCart();
    }
  }, [isAuthenticated]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("type");
    localStorage.removeItem("userId");
    navigate("/");
  }, [navigate]);

  const { pathname } = useLocation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        handleLogout();
        if (
          pathname !== "/" ||
          pathname !== "/restaurants" ||
          pathname.includes("/restaurant") ||
          pathname.includes("/login") ||
          pathname.includes("/register")
        ) {
          navigate("/");
        }
      }
    }
  }, [navigate, handleLogout]);

  console.log("homeProps.searchValue", homeProps.searchValue);

  return (
    <div className="d-flex">
      <BootstrapNavbar collapseOnSelect expand="false">
        <BootstrapNavbar.Toggle
          aria-controls="offcanvasNavbar-expand-false"
          onClick={handleOffcanvasToggle}
        />
        <BootstrapNavbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end yum-nav flavor-fleet-nav"
        >
          <BootstrapNavbar.Offcanvas
            id={`offcanvasNavbar-expand-false`}
            aria-labelledby={`offcanvasNavbarLabel-expand-false`}
            placement="start"
            show={showOffcanvas}
            onHide={handleOffcanvasToggle}
          >
            <Offcanvas.Header>
              <Nav.Link
                className="text-uppercase text-success text-center fw-bold fs-5"
                as={Link}
                to="/"
              >
                FlavorFleet
              </Nav.Link>
              <Button
                variant="close"
                aria-label="Close"
                onClick={handleOffcanvasToggle}
                className="ms-auto bg-transparent"
              />
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="fw-bold">
                <Nav.Link
                  as={Link}
                  to="/restaurants"
                  className="text-uppercase text-primary text-center fw-bold fs-5"
                >
                  Restaurants
                </Nav.Link>

                <>
                  {isAuthenticated && type === "user" ? (
                    <div className="text-center">
                      <NavDropdown
                        title={localStorage?.getItem("name")}
                        id="navbarScrollingDropdown"
                        className="text-uppercase text-primary"
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

                      <div className="position-relative">
                        <p
                          onClick={toggleDropdown}
                          className=" text-uppercase text-primary py-0 mt-1 fs-4"
                          type="button"
                          style={{ border: "none", background: "transparent" }}
                        >
                          <i className="bi bi-bell"></i>
                        </p>
                        {isOpen && (
                          <div
                            className="dropdown-menu show"
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: 0,
                              width: "350px",
                              overflowY: "auto",
                              backgroundColor: "#fff",
                              zIndex: 1000,
                              color: "#333",
                            }}
                          >
                            {notificationsData?.notifications.length > 0 ? (
                              notificationsData.notifications
                                ?.slice(0, 5)
                                .map((notification) => (
                                  <div
                                    key={notification._id}
                                    className="dropdown-item"
                                    style={{
                                      borderBottom: "1px solid #ddd",
                                    }}
                                  >
                                    <div className="mb-0 text-dark mt-4">
                                      <p style={{ fontSize: "15px" }}>
                                        Order from {notification.restaurantName}
                                        <span className="d-block mt-2">
                                          is {notification.status}{" "}
                                        </span>
                                      </p>
                                      <p
                                        className="text-end"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {formatTimestamp(notification?.date)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div
                                className="dropdown-item d-flex justify-content-center align-items-center text-dark text-center"
                                style={{ minHeight: "300px" }}
                              >
                                No Notifications
                              </div>
                            )}
                            {notificationsData?.notifications.length ===
                            0 ? null : (
                              <div
                                onClick={() => navigate("/notifications")}
                                className="dropdown-item text-center"
                                style={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  backgroundColor: "#f8f9fa",
                                  color: "#333",
                                }}
                              >
                                Show All
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </>

                {!isAuthenticated && type !== "user" ? (
                  <>
                    <NavDropdown
                      title="Business"
                      className="text-uppercase text-primary text-center fw-bold fs-5"
                    >
                      <NavDropdown.Item
                        className="text-uppercase fw-bold text-primary"
                        as={Link}
                        to="/restaurant-login"
                      >
                        Login
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        className="text-uppercase fw-bold text-primary"
                        as={Link}
                        to="/restaurant-register"
                      >
                        Signup
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link
                      className="text-uppercase text-primary text-center fw-bold fs-5"
                      as={Link}
                      to="/admin/login"
                    >
                      Super Admin
                    </Nav.Link>
                  </>
                ) : null}
              </Nav>
            </Offcanvas.Body>
          </BootstrapNavbar.Offcanvas>
        </BootstrapNavbar.Collapse>
      </BootstrapNavbar>
      <Navbar collapseOnSelect expand="lg" className="main-nav">
        <Nav.Link as={Link} to="/">
          <h5 className="text-uppercase text-success fw-bold">FlavorFleet</h5>
        </Nav.Link>

        <Form.Group className="home-search" controlId="formSearch">
          <Form.Control
            type="text"
            placeholder="Search For Food"
            value={homeProps.searchValue}
            onChange={homeProps.handleSearch}
          />
          <span
            className="home-search-button cursor-pointer"
            onClick={homeProps.handleSearchTerm}
          >
            <i className="bi bi-search "></i>
          </span>
        </Form.Group>

        {isAuthenticated && type === "user" ? (
          <Nav.Link className="cart mx-3" as={Link} to="/cart">
            <i className="bi bi-cart"></i>
            <span className="cart-item-count">
              {cartData?.cart?.totalCount || 0}
            </span>
          </Nav.Link>
        ) : (
          <Nav.Link
            className="text-uppercase text-success text-center fw-bold fs-5"
            as={Link}
            to="/login"
          >
            Login
          </Nav.Link>
        )}
      </Navbar>
    </div>
  );
};

export default FlavorFleetNavbar;
