import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useMutation, useQuery } from "@apollo/client";
import Skeleton from "react-loading-skeleton";
import {
  GET_FOOD_ITEMS,
  GET_RESTAURANTS,
} from "../services/graphql/restaurant";
import { Link, useLocation } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import {
  ADD_TO_CART,
  ADD_TO_FAVOURITE,
  CART,
  FAVOURITE,
} from "../services/graphql/auth";
import { getImageUrl } from "../utils/helper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Navbar from "../components/navbar";
import YumCard from "../components/YumCard";
import MenuItems from "../components/MenuItems";

const HomePage = () => {
  const location = useLocation();
  const [categorySelected, setCategorySelected] = useState(null);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { data, error, loading, refetch } = useQuery(GET_FOOD_ITEMS, {
    variables: {
      filter: {
        search: searchTerm,
        category: categorySelected,
      },
    },
  });

  const {
    data: restaurantData,
    error: restaurantsError,
    loading: restaurantsLoading,
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
  const [imageUrl, setImageUrl] = useState(null);
  const [categroyLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategoryLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      setName("Cart");
      setIsItemAdded(true);
    },
    refetchQueries: [{ query: CART }],
  });

  const [addToFavourite] = useMutation(ADD_TO_FAVOURITE, {
    onCompleted: () => {
      setName("Favourite");
      setIsItemAdded(true);
    },
    refetchQueries: [{ query: FAVOURITE }],
  });

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
    const cartAddedTimer = setTimeout(() => {
      setIsItemAdded(false);
    }, 3000);
    return () => clearTimeout(cartAddedTimer);
  }, [isItemAdded]);

  const handleCart = useCallback(
    async (data) => {
      setIsItemAdded(false);
      await addToCart({
        variables: {
          cartItems: {
            item: data?.item,
            restaurantId: data?.restaurantId,
          },
        },
      });
    },
    [addToCart]
  );

  const handleFavourite = useCallback(
    async (itemId) => {
      setIsItemAdded(false);
      await addToFavourite({
        variables: {
          favouriteItems: {
            itemId: itemId,
            restaurantId: data?.restaurantId,
          },
        },
      });
    },
    [addToFavourite]
  );

  const types = [
    { id: 1, name: "Indian", image: "indian-food.jpg" },
    { id: 2, name: "Fast Food", image: "fast-food.jpg" },
    { id: 3, name: "Thai", image: "thai-food.jpg" },
    { id: 4, name: "Mexican", image: "mexican-food.jpg" },
    { id: 5, name: "Italian", image: "italian-food.jpg" },
    { id: 6, name: "Chinese", image: "chinese-food.jpg" },
    { id: 7, name: "French", image: "french-food.jpg" },
  ];

  const handleCategory = (name) => {
    console.log(name);
    console.log(categorySelected);

    if (categorySelected == name) {
      console.log(1);
      setSearchTerm("");
      setSearchValue("");
      setCategorySelected(null);
      return refetch({ filter: { search: "", category: null } });
    }
    setCategorySelected(name);
    return refetch({ filter: { search: searchTerm, category: name } });
  };

  const handleSearchTerm = () => {
    setSearchTerm(searchValue);
  };

  return (
    <div>
      <Navbar
        searchValue={searchValue}
        handleSearch={handleSearch}
        handleSearchTerm={handleSearchTerm}
      />
      <main>
        <div className="food-categories mt-4">
          {types.map((type, index) =>
            categroyLoading ? (
              <div key={index} className="align-items-center cursor-pointer">
                <Skeleton circle={true} height={100} width={100} />
                <p className="mt-1 text-success fw-bold">
                  <Skeleton width={80} />
                </p>
              </div>
            ) : (
              <div
                key={type.id}
                className={`align-items-center cursor-pointer ${
                  categorySelected == type.name ? "selected-category" : null
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategory(type.name);
                }}
              >
                <LazyLoadImage
                  width={100}
                  height={100}
                  src={require(`../utils/Pics/${type.image}`)}
                  alt={type.name}
                  effect="blur"
                />
                <p className="mt-1 text-success fw-bold">{type.name}</p>
              </div>
            )
          )}
        </div>

        {searchTerm == "" ? (
          <>
            <div className="my-5 px-5">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="text-success fw-bold">Featured Items</h4>
                <Link to="/restaurants" className="text-success fw-bold">
                  View All
                </Link>
              </div>
              <div className="d-flex justify-content-between flex-wrap">
                {data?.foodItems?.slice(0, 8)?.map((item, index) =>
                  loading || categroyLoading ? (
                    <div key={index} className="align-items-center mx-4">
                      <Skeleton height={200} width={300} />
                      <h5 className="fw-bold mt-2">
                        <Skeleton width={150} />
                      </h5>
                      <p className="mt-1 text-success fw-bold">
                        <Skeleton width={300} />
                      </p>
                    </div>
                  ) : (
                    <MenuItems
                      key={item.id}
                      item={item}
                      width={"18rem"}
                      imgHeight="200px"
                      handleCart={handleCart}
                      handleFavourite={handleFavourite}
                      isHome={true}
                    />
                  )
                )}
              </div>
            </div>

            {/* Restaurants Section */}
            <div className="my-5 px-5">
              <div className="d-flex justify-content-between mb-4">
                <h4 className="text-success fw-bold">Featured Restaurants</h4>
                <Link to="/restaurants" className="text-success fw-bold">
                  View All
                </Link>
              </div>
              <div className="d-flex flex-wrap">
                {restaurantsLoading ? (
                  <Skeleton count={5} />
                ) : (
                  restaurantData?.restaurant?.slice(0, 5)?.map(
                    (item) =>
                      item?.status !== "Blocked" &&
                      item?.status !== "Pending" && (
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
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="my-5 px-5">
            <h4 className="fw-bold text-success d-flex justify-content-between mb-4 ">
              {data?.foodItems?.length} Results
            </h4>
            {data?.foodItems?.length == 0 ? (
              <div className="unavailable-container">
                <h5 className="text-success fw-bold">
                  No Food Items Available
                </h5>
              </div>
            ) : null}
            <div className="d-flex justify-content-between flex-wrap">
              {loading ? (
                <Skeleton count={5} />
              ) : (
                data?.foodItems?.map((item) => (
                  <MenuItems
                    key={item.id}
                    item={item}
                    width={"18rem"}
                    imgHeight="200px"
                    handleCart={handleCart}
                    handleFavourite={handleFavourite}
                    isHome={true}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer>Copyright © 2024 FlavorFleet. All Rights Reserved</footer>

      <div className="d-flex justify-content-center">
        {isItemAdded && name && (
          <Alert variant="success" className="cart-alert">
            Item Added To {name}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default HomePage;
