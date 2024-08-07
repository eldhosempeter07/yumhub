import React, { useState, useEffect } from "react";
import burgerImage from "../styles/images/burger.jpg";
import logoMainImage from "../styles/images/logoMain.jpg";
import Navbar from "./navbar";
import YumCard from "./YumCard";
import { useQuery } from "@apollo/client";
import {
  GET_FOOD_ITEMS,
  GET_RESTAURANTS,
} from "../services/graphql/restaurant";
const HomePage = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const { data, error, loading } = useQuery(GET_FOOD_ITEMS);
  const {
    data: restaurantData,
    error: resturantsError,
    loading: resturantsLoading,
  } = useQuery(GET_RESTAURANTS);

  return (
    <div>
      <Navbar />
      <main>
        {/* Foods  */}
        <div className="my-5 px-5">
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-success fw-bold">Featured Items</h4>
            <a href="/restaurant" className="text-success fw-bold">
              View All
            </a>
          </div>
          <div className="d-flex justify-content-between  flex-wrap">
            {data?.foodItems?.length > 0 &&
              data?.foodItems
                ?.slice(0, 6)
                ?.map((item) => (
                  <YumCard
                    name={item?.name}
                    desc={`CA$${item?.price}`}
                    width={"13rem"}
                    imgHeight="200px"
                  />
                ))}
          </div>
        </div>
        <hr className="px-0" />
        {/* Restaurants  */}
        <div className="my-5 px-5">
          <div className="d-flex justify-content-between mb-4">
            <h4 className="text-success fw-bold">Featured Restaurants</h4>
            <a href="/restaurant" className="text-success fw-bold">
              View All
            </a>
          </div>
          <div className="d-flex justify-content-between  flex-wrap">
            {restaurantData?.restaurant?.length > 0 &&
              restaurantData?.restaurant
                ?.slice(0, 6)
                ?.map((item) => (
                  <YumCard
                    name={item?.name}
                    desc={item?.location}
                    width={"13rem"}
                    imgHeight="200px"
                  />
                ))}
          </div>
        </div>
      </main>
      <footer>
        Copyright © 2020-2021 OnlineFoodShop. All Rights are reserved
      </footer>
    </div>
  );
};

export default HomePage;
