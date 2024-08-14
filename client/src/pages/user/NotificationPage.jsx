import React from "react";
import { GET_NOTIFICATIONS } from "../../services/graphql/auth";
import { useQuery } from "@apollo/client";
import { formatTimestamp } from "../../utils/helper";
import Navbar from "../../components/navbar";
import { Card } from "react-bootstrap";

const NotificationsPage = () => {
  const { data: notificationsData } = useQuery(GET_NOTIFICATIONS);
  return (
    <>
      <Navbar />
      <div className=" mt-4">
        <h3 className="mb-4 fw-bold text-center">All Notifications</h3>
        {notificationsData?.notifications.length > 0 ? (
          <div className="list-group d-flex justify-content-center">
            {notificationsData.notifications.map((notification, i) => (
              <Card
                className="mx-auto my-4 border border-3 px-4 py-4 my-3 rounded "
                style={{ minWidth: "800px" }}
              >
                <div className="d-flex flex-wrap justify-content-center w-100">
                  <div className="px-0 w-100 mt-4 mx-3">
                    <span className="fw-bold cart-item-name text-success">
                      Order from {notification.restaurantName} is{" "}
                      {notification.status}
                    </span>
                    <p className="text-end mt-3">
                      {" "}
                      {formatTimestamp(notification?.date)}
                    </p>
                  </div>
                </div>
              </Card>

              // <div className="mb-0 text-dark" key={i}>
              //   <p style={{ fontSize: "15px" }}>
              //     Order from {notification.restaurantName}
              //     <span className="d-block">is {notification.status} </span>
              //   </p>
              //   <p className="text-end" style={{ fontSize: "14px" }}>
              //     {formatTimestamp(notification?.date)}
              //   </p>
              // </div>
            ))}
          </div>
        ) : (
          <p>No Notifications</p>
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
