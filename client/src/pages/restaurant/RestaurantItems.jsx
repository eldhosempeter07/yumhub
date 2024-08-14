import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  DELETE_FOOD_ITEM,
  RESTAURANT_ITEMS,
} from "../../services/graphql/restaurant";
import SideNavbar from "../../components/SideNavbar";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "firebase/storage";
import { getImageUrl } from "../../utils/helper";

const RestaurantItems = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const { data, loading } = useQuery(RESTAURANT_ITEMS);
  const [deleteFoodItem] = useMutation(DELETE_FOOD_ITEM, {
    refetchQueries: [{ query: RESTAURANT_ITEMS }],
  });

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getImageUrl(
        "gs://yumhub-d8edd.appspot.com/BIRIYANI.jpg"
      );
      setImageUrl(url);
    };

    fetchImageUrl();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Row>
      <Col lg={2} className="bg-dark admin-height">
        <SideNavbar />
      </Col>
      <Col lg={8}>
        <div className="mx-5">
          <div className="text-end mt-3">
            <Link to="/add-item" className="btn text-white">
              Add New
            </Link>
          </div>
          <h3 className="font-bold text-success text-center uppercase fw-bold my-4 ">
            Food Items
          </h3>
          <Table bordered hover responsive>
            <thead className="">
              <tr className="text-center bg-dark">
                <th className="text-success">Name</th>
                <th className="text-success">Description</th>
                <th className="text-success">Price</th>
                <th className="text-success">Category</th>
                <th className="text-success">Image</th>
                <th className="text-success">Rating</th>
                <th className="text-success"></th>
              </tr>
            </thead>
            <tbody>
              {data?.restaurantItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>$ {item.price}</td>
                  <td> {item.category}</td>
                  <td>
                    <img
                      // variant="top"
                      src={imageUrl?.replace("BIRIYANI.jpg", item.imageURL)}
                      // src={getImageUrl("BIRIYANI.jpg")}
                      height={"80px"}
                      width={"80px"}
                    />
                    {/* {item.imageURL} */}
                  </td>
                  <td>{item.rating}</td>
                  <td>
                    <span
                      className="cart-item-delete cursor-pointer text-success"
                      onClick={() => navigate(`/edit-item/${item.id}`)}
                    >
                      <i className="bi bi-pencil-square"></i>{" "}
                    </span>
                    <span
                      className="cart-item-delete mx-2 cursor-pointer text-danger"
                      onClick={() =>
                        deleteFoodItem({ variables: { id: item.id } })
                      }
                    >
                      <i class="bi bi-trash3-fill"></i>{" "}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );
};

export default RestaurantItems;
