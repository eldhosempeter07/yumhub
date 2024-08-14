import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import SideNavbar from "../../components/SideNavbar";
import { Button, Col, Nav, Row, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { convertTo12Hour } from "../../utils/helper";
import {
  ADMIN_DELETE_USER,
  RESTAURANTS,
  USERS,
} from "../../services/graphql/admin";
import AdminSideNav from "../../components/AdminSideNav";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(USERS);
  const [adminDeleteUser] = useMutation(ADMIN_DELETE_USER, {
    refetchQueries: [{ query: USERS }],
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Row>
      <Col lg={2} className="admin-nav admin-height">
        <AdminSideNav />
      </Col>
      <Col lg={8}>
        <h3 className="font-bold text-success text-center uppercase fw-bold mt-4 mb-5">
          Users
        </h3>
        {data?.users?.length == 0 ? (
          <div className="d-flex  justify-content-center align-items-center  mb-2">
            <h5 className="fw-bold">No Users Available</h5>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="">
              <tr className="text-center bg-dark">
                <th className="text-success">Name</th>
                <th className="text-success">Email</th>
                <th className="text-success">Phone</th>
                <th className="text-success">Status</th>
                <th className="text-success">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((item) => (
                <tr key={item?.id}>
                  <td className="w-50">{item?.name}</td>
                  <td className="w-50"> {item?.email}</td>
                  <td className="w-50">{item?.phone}</td>
                  <td className="w-50">{item?.status}</td>
                  <td className="d-flex">
                    <a
                      className="cart-item-delete cursor-pointer text-success"
                      href={`/admin/user/edit/${item?._id}`}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </a>
                    <span
                      className="cart-item-delete mx-2 cursor-pointer text-danger mx-3"
                      onClick={() =>
                        adminDeleteUser({ variables: { id: item?._id } })
                      }
                    >
                      <i class="bi bi-trash3-fill"></i>{" "}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default AdminUsers;
