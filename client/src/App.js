import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserLoginPage from "./pages/user/UserLoginPage";
import RestaurantLoginPage from "./pages/restaurant/RestaurantLoginPage";
import RestaurantRegisterPage from "./pages/restaurant/RestaurantRegisterPage";
import UserRegisterPage from "./pages/user/UserRegisterPage";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import ProtectedRoute from "./services/protectedRoute";
import Profile from "./pages/user/Profile";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Address from "./pages/user/Address";
import Payment from "./pages/user/Payment";
import Confirmation from "./pages/user/Confirmation";
import { useQuery } from "@apollo/client";
import { CART } from "./services/graphql/auth";
import Orders from "./pages/user/Orders";
import Favourites from "./pages/user/Favourites";
import { Spinner } from "react-bootstrap";
import RestaurantOrders from "./pages/restaurant/RestaurantOrders";
import RestaurantItems from "./pages/restaurant/RestaurantItems";
import RestaurantAddItems from "./pages/restaurant/RestaurantAddItems";
import RestaurantEditItem from "./pages/restaurant/RestaurantEditItem";
import RestaurantEditOrder from "./pages/restaurant/RestaurantEditOrder";
import Dashboard from "./pages/restaurant/Dashboard";
import BusinessProtectedRoute from "./services/businessProtectedRoute";
import RestaurantTimings from "./pages/restaurant/RestaurantTimings";
import RestaurantAddTiming from "./pages/restaurant/RestaurantAddTiming";
import RestaurantEditTiming from "./pages/restaurant/RestaurantEditTiming";
import RestaurantProfile from "./pages/restaurant/RestaurantProfile";
import AdminLogin from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRestaurant from "./pages/admin/AdminRestaurant";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminEditOrder from "./pages/admin/AdminEditOrder";
import AdminEditRestaurant from "./pages/admin/AdminEditRestaurant";
import AdminEditUser from "./pages/admin/AdminEditUser";
import AdminProtectedRoute from "./services/adminProtetedRoute";
import RootRoute from "./services/rootRoute";
import NotificationsPage from "./pages/user/NotificationPage";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const type = localStorage.getItem("type");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <RootRoute element={<HomePage />} />
            </Suspense>
          }
        />
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="dashboard"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminDashboard />} />
              </Suspense>
            }
          />
          <Route
            path="restaurant"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminRestaurant />} />
              </Suspense>
            }
          />
          <Route
            path="restaurant/edit/:id"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminEditRestaurant />} />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminUsers />} />
              </Suspense>
            }
          />
          <Route
            path="user/edit/:id"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminEditUser />} />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminOrders />} />
              </Suspense>
            }
          />
          <Route
            path="order/edit/:resId/:id"
            element={
              <Suspense
                fallback={
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" />
                  </div>
                }
              >
                <AdminProtectedRoute element={<AdminEditOrder />} />
              </Suspense>
            }
          />
          {/* <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="restaurant" element={<AdminRestaurant />} />
          <Route path="restaurant/edit/:id" element={<AdminEditRestaurant />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="user/edit/:id" element={<AdminEditUser />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="order/edit/:resId/:id" element={<AdminEditOrder />} /> */}
        </Route>
        <Route path="/restaurant-login" element={<RestaurantLoginPage />} />
        <Route
          path="/restaurant-register"
          element={<RestaurantRegisterPage />}
        />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        <Route
          path="/profile"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Profile />} />
            </Suspense>
          }
        />

        <Route
          path="/notifications"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<NotificationsPage />} />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Cart />} />
            </Suspense>
          }
        />

        <Route
          path="/checkout"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Checkout />} />
            </Suspense>
          }
        />

        <Route
          path="/address"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Address />} />
            </Suspense>
          }
        />

        <Route
          path="/favourites"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Favourites />} />
            </Suspense>
          }
        />

        <Route
          path="/orders"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Orders />} />
            </Suspense>
          }
        />

        <Route
          path="/payment"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Payment />} />
            </Suspense>
          }
        />

        <Route
          path="/success"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Confirmation />} />
            </Suspense>
          }
        />
        {/* Business  */}

        <Route
          path="/dashboard"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <ProtectedRoute element={<Dashboard />} />
            </Suspense>
          }
        />

        <Route
          path="/restaurant-orders"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantOrders />} />
            </Suspense>
          }
        />

        <Route
          path="/edit-order/:id"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantEditOrder />} />
            </Suspense>
          }
        />

        <Route
          path="/restaurant-items"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantItems />} />
            </Suspense>
          }
        />

        <Route
          path="/add-item"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantAddItems />} />
            </Suspense>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantEditItem />} />
            </Suspense>
          }
        />

        <Route
          path="/restaurant-timing"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantTimings />} />
            </Suspense>
          }
        />

        <Route
          path="/add-timing"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantAddTiming />} />
            </Suspense>
          }
        />

        <Route
          path="/restaurant-timing/:id"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantEditTiming />} />
            </Suspense>
          }
        />

        <Route
          path="/restaurant-profile"
          element={
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                  <Spinner animation="border" />
                </div>
              }
            >
              <BusinessProtectedRoute element={<RestaurantProfile />} />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
