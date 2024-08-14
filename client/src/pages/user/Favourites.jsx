import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { FAVOURITE, REMOVE_FROM_FAVOURITE } from "../../services/graphql/auth";
import Navbar from "../../components/navbar";
import FavouriteCard from "../../components/FavouriteCard";

const Favourites = () => {
  const { data } = useQuery(FAVOURITE);
  const [removeFromFavourite] = useMutation(REMOVE_FROM_FAVOURITE, {
    refetchQueries: [{ query: FAVOURITE }],
  });

  const handleDeleteFavoriteItem = (itemId) => {
    removeFromFavourite({
      variables: {
        itemId,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="cart-container ">
        <h3 className="text-center text-success fw-bold my-4">Favourites</h3>
        <div className="mx-auto overflow-hidden fav-container">
          <div className="mx-3  ">
            {data?.favourite?.items?.length > 0 ? (
              data?.favourite?.items?.map((item) => (
                <div className="border border-3 px-4 my-5 rounded">
                  <FavouriteCard
                    item={item}
                    width={"50rem"}
                    imgHeight="200px"
                    handleDeleteFavoriteItem={handleDeleteFavoriteItem}
                  />
                </div>
              ))
            ) : (
              <div className="text-center my-5">
                <div className="d-flex justify-content-center align-items-center fw-bold mb-2">
                  <h5>Favourites Is Empty</h5>
                </div>
                <a href="/restaurants" className="text-success fw-bold">
                  Go Back To Restaurants
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favourites;
