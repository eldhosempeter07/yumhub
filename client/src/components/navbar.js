import React, { useEffect, useState } from "react";
import { Navbar as BootstrapNavbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CART, GET_NOTIFICATIONS } from "../services/graphql/auth";
import Logo from "../utils/Pics/Logo.jpg";
import { formatTimestamp, isTokenExpired } from "../utils/helper";

const Navbar = () => {
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

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      if (isTokenExpired(token)) {
        handleLogout();
        if (
          location.pathname !== "/" ||
          location.pathname !== "/restaurants" ||
          location.pathname.includes("/restaurant") ||
          location.pathname.includes("/login") ||
          location.pathname.includes("/register")
        ) {
          navigate("/");
        }
      }
    }
  }, [navigate, handleLogout]);

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

              <div className="position-relative">
                <p
                  onClick={toggleDropdown}
                  className=" text-uppercase py-0 mt-1 fs-4"
                  type="button"
                  style={{ border: "none", background: "transparent" }}
                >
                  <i class="bi bi-bell"></i>
                </p>
                {isOpen && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      width: "400px",
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
                    {notificationsData?.notifications.length == 0 ? null : (
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

              <Nav.Link className="text-white cart" as={Link} to="/cart">
                <i className="bi bi-cart"></i>
                <span className="cart-item-count">
                  {cartData?.cart?.totalCount || 0}
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
          {!isAuthenticated && type !== "user" ? (
            <>
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
              <Nav.Link
                className="text-white text-uppercase"
                as={Link}
                to="/admin/login"
              >
                Super Admin
              </Nav.Link>
            </>
          ) : null}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
