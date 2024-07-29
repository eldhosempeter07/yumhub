import { useMutation, useQuer, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  GET_FOOD_ITEMS_BY_RESTAUTANT,
  GET_RESTAURANT_BY_ID,
} from "../services/graphql/restaurant";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import MenuItems from "../components/MenuItems";
import {
  ADD_TO_CART,
  ADD_TO_FAVOURITE,
  CART,
  FAVOURITE,
  GET_RESTAURANT_TIMING_BY_DAY,
} from "../services/graphql/auth";
import { Alert, Spinner } from "react-bootstrap";
import { getImageUrl, handleOpen } from "../utils/helper";

const RestaurantDetails = () => {
  const { id } = useParams();
  const { data, loading } = useQuery(GET_RESTAURANT_BY_ID, {
    variables: { id },
  });

  let currentDate = new Date();
  let currentDay = currentDate.toLocaleDateString("en-US", { weekday: "long" });

  const { data: timingData, loading: timingLoading } = useQuery(
    GET_RESTAURANT_TIMING_BY_DAY,
    {
      variables: {
        timing: { id: data?.restaurantById?.email, day: currentDay },
      },
      onCompleted: (data) => {
        setIsOpen(
          handleOpen(
            data?.getRestaurantTimingByDay?.start,
            data?.getRestaurantTimingByDay?.end
          )
        );
      },
    }
  );

  const { data: foodItemsData, loading: foodItemsLoading } = useQuery(
    GET_FOOD_ITEMS_BY_RESTAUTANT,
    {
      variables: { id },
    }
  );

  const [isItemAdded, setIsItemAdded] = useState(false);
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
        "gs://yumhub-d8edd.appspot.com/BIRIYANI.jpg"
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
          restaurantId: id,
        },
      },
    });
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="mx-5 mt-1">
          {imageUrl == null ? (
            <div>Loading</div>
          ) : (
            <div className="resturant-img">
              <img
                className="rounded"
                width="100%"
                src={
                  data?.restaurantById?.image
                    ? imageUrl?.replace(
                        "BIRIYANI.jpg",
                        data?.restaurantById?.image
                      )
                    : require(`../utils/Pics/dummy.jpg`)
                }
                alt="Restaurant"
              />

              {!timingLoading && isOpen ? (
                <p className="restaurant-status">
                  <span>Open</span>
                </p>
              ) : (
                <p className="restaurant-status bg-danger">
                  <span>Closed</span>
                </p>
              )}
            </div>
          )}

          {/* Restaurant Name and Location */}
          <div className="d-flex flex-wrap justify-content-between mt-4 mx-1">
            <div>
              <h2 className="fw-bold text-success">
                {data?.restaurantById?.name}
              </h2>
              <p>4.8⭐ {data?.restaurantById?.type}</p>
            </div>
            <div>
              <h5 className="fw-bold text-success">
                {data?.restaurantById?.location}
              </h5>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h5>Menu</h5>
            <div className="d-flex justify-content-between flex-wrap">
              {foodItemsData?.foodItemsByRestaurant?.map((item) => (
                <MenuItems
                  key={item.id}
                  item={item}
                  width={"18rem"}
                  imgHeight="200px"
                  handleCart={handleCart}
                  handleFavourite={handleFavourite}
                  isOpen={isOpen}
                />
              ))}
            </div>
          </div>
        </div>
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

export default RestaurantDetails;
