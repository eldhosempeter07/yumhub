import React, { useState, useEffect } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { GET_RESTAURANTS } from "../services/graphql/restaurant";
import YumCard from "../components/YumCard";
import Navbar from "../components/navbar";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const {
    data: restaurantData,
    error: resturantsError,
    loading: resturantsLoading,
    refetch: refetchRestaurants,
  } = useQuery(GET_RESTAURANTS, {
    variables: {
      filter: {
        search: searchTerm,
        category: filteredRestaurants,
      },
    },
  });

  useEffect(() => {
    refetchRestaurants();
  }, []);

  const types = [
    { id: 1, name: "Indian" },
    { id: 2, name: "Fast Food" },
    { id: 3, name: "Thai" },
    { id: 4, name: "Mexican" },
    { id: 5, name: "Italian" },
    { id: 6, name: "Chinese" },
    { id: 7, name: "French" },
  ];
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    refetchRestaurants({
      filter: {
        search: searchTerm,
        category: filteredRestaurants,
      },
    });
  }, [searchTerm, filteredRestaurants]);

  const handleFilter = (name) => {
    if (filteredRestaurants.includes(name)) {
      const items = filteredRestaurants.filter((item) => item != name);
      setFilteredRestaurants(items);
    } else {
      setFilteredRestaurants([...filteredRestaurants, name]);
    }
  };

  return (
    <>
      <Navbar />
      {resturantsLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* <Row className="restaurant-row mt-3 ">
            <Col lg={2}></Col>
            <Col lg={6} sm={8}>
              <Form.Group controlId="formSearch">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearch}
                  className="search"
                />
              </Form.Group>
            </Col>
            <Col lg={3} sm={2} className="search-btn-container">
              <span
                className="search-button btn"
                onClick={() => setSearchTerm(searchValue)}
              >
                <i className="bi bi-search "></i>
              </span>
            </Col>
          </Row> */}
          {resturantsLoading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row className="mw-100 mt-5">
              <Col lg={3} className=" categories d-flex justify-content-center">
                <div>
                  <h5 className="fw-bold ">Filters</h5>
                  <div className="mt-5">
                    <>
                      <h6 className="my-4 fw-bold text-uppercase">
                        Categories
                      </h6>
                      {types.map((type) => (
                        <Form.Check
                          type="checkbox"
                          id={`${type.name}-checkbox`}
                          label={type.name}
                          className="my-3"
                          key={type.id}
                          onClick={() => {
                            handleFilter(type.name);
                          }}
                          checked={filteredRestaurants.includes(type.name)}
                        />
                      ))}
                    </>
                  </div>
                </div>
              </Col>
              <Col lg={8} className="res-item flex-wrap">
                {restaurantData?.restaurant?.length > 0 ? (
                  restaurantData?.restaurant?.map((item) =>
                    item?.status == "Blocked" ||
                    item?.status == "Pending" ? null : (
                      <Link
                        className="text-decoration-none my-4 mx-2"
                        to={`/restaurant/${item?.id}`}
                        key={item.id}
                      >
                        <YumCard
                          name={item?.name}
                          desc={item?.location}
                          imageURL={item?.image}
                          width={"19rem"}
                          imgHeight="250px"
                        />
                      </Link>
                    )
                  )
                ) : (
                  <Col
                    lg={9}
                    className="text-center fw-bold text-success d-flex justify-content-around align-items-center flex-wrap "
                  >
                    <h4>No Restaurants Found</h4>
                  </Col>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default Restaurants;
