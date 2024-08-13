import React, { useState, useEffect, useLayoutEffect } from "react";
import Navbar from "../components/navbar";
import YumCard from "../components/YumCard";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_FOOD_ITEMS,
  GET_RESTAURANTS,
} from "../services/graphql/restaurant";
import { Link, useLocation } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import MenuItems from "../components/MenuItems";
import {
  ADD_TO_CART,
  ADD_TO_FAVOURITE,
  CART,
  FAVOURITE,
} from "../services/graphql/auth";
import { getImageUrl } from "../utils/helper";
const HomePage = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { data, error, loading } = useQuery(GET_FOOD_ITEMS);
  const {
    data: restaurantData,
    error: resturantsError,
    loading: resturantsLoading,
  } = useQuery(GET_RESTAURANTS, {
    variables: {
      filter: {
        search: "",
        category: [],
      },
    },
  });

  const [isItemAdded, setIsItemAdded] = useState(false);
  const [name, setName] = useState("");
  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      setName("Cart");
      setIsItemAdded(true);
    },
    refetchQueries: [{ query: CART }],
  });

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getImageUrl(
        "gs://yumhub-d8edd.appspot.com/tim_hortons.jpg"
      );
      setImageUrl(url);
    };

    fetchImageUrl();
  }, []);

  useEffect(() => {
    const cartAddedTimer = setInterval(() => {
      setIsItemAdded(false);
    }, 3000);
    return () => clearInterval(cartAddedTimer);
  }, [isItemAdded]);

  const [addToFavourite] = useMutation(ADD_TO_FAVOURITE, {
    onCompleted: () => {
      setName("Favourite");
      setIsItemAdded(true);
    },
    refetchQueries: [{ query: FAVOURITE }],
  });

  const handleCart = async (data) => {
    setIsItemAdded(false);
    await addToCart({
      variables: {
        cartItems: {
          item: data?.item,
          restaurantId: data?.restaurantId,
        },
      },
    });
  };

  const handleFavourite = async (itemId) => {
    setIsItemAdded(false);
    await addToFavourite({
      variables: {
        favouriteItems: {
          itemId: itemId,
          restaurantId: data?.restaurantId,
        },
      },
    });
  };

  return (
    <div>
      <Navbar />
      {resturantsLoading || imageUrl == null ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <main>
            <div className="resturant-img">
              <img
                className="rounded"
                width="100%"
                src={imageUrl}
                alt="Restaurant"
              />
            </div>

            {/* Foods  */}
            <div className="my-5 px-5">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="text-success fw-bold">Featured Items</h4>
                <a href="/restaurants" className="text-success fw-bold">
                  View All
                </a>
              </div>
              <div className="d-flex justify-content-between  flex-wrap">
                {data?.foodItems?.length > 0 &&
                  data?.foodItems
                    ?.slice(0, 8)
                    ?.map((item) => (
                      <MenuItems
                        key={item.id}
                        item={item}
                        width={"18rem"}
                        imgHeight="200px"
                        handleCart={handleCart}
                        handleFavourite={handleFavourite}
                        isHome={true}
                      />
                    ))}
              </div>
            </div>

            {/* Restaurants  */}
            <div className="my-5 px-5">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="text-success fw-bold">Featured Restaurants</h4>
                <a href="/restaurant" className="text-success fw-bold">
                  View All
                </a>
              </div>
              <div className="d-flex flex-wrap">
                {restaurantData?.restaurant?.length > 0 &&
                  restaurantData?.restaurant?.map((item) =>
                    item?.status == "Blocked" ||
                    item?.status == "Pending" ? null : (
                      <Link
                        className="text-decoration-none mx-3"
                        to={`/restaurant/${item?.id}`}
                        key={item.id}
                      >
                        <YumCard
                          name={item?.name}
                          desc={item?.location}
                          imageURL={item?.image}
                          width={"13rem"}
                          imgHeight="200px"
                        />
                      </Link>
                    )
                  )}
              </div>
            </div>
          </main>
          <footer>
            Copyright © 2020-2021 OnlineFoodShop. All Rights are reserved
          </footer>
        </>
      )}
      <div className="d-flex justify-content-center">
        {isItemAdded && name != "" ? (
          <Alert variant="success" className="cart-alert">
            Item Added To {name}
          </Alert>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
