import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useLayoutEffect } from "react";
import {
  ADD_TO_CART,
  CART,
  DELETE_CART_ITEM,
  EMPTY_CART,
} from "../../services/graphql/auth";
import CartItems from "../../components/CartItems";
import Navbar from "../../components/navbar";
import { Button, Nav, Row, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import CartPopup from "../../components/CartPopup";

const Cart = () => {
  const { data, loading } = useQuery(CART);
  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: CART }],
  });

  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
    onCompleted: () => {
      console.log("Success");
    },
    refetchQueries: [{ query: CART }],
  });

  const [emptyCart] = useMutation(EMPTY_CART, {
    onCompleted: () => {
      setShowModal(false);
    },
    refetchQueries: [{ query: CART }],
  });

  const handleCart = async (item, restaurantId) => {
    await addToCart({
      variables: {
        cartItems: {
          item,
          restaurantId: restaurantId,
        },
      },
    });
  };

  const handleDeleteCartItem = async (id) => {
    await deleteCartItem({
      variables: {
        itemId: id,
      },
    });
  };

  const handleEmptyCart = async () => {
    await emptyCart();
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="cart-container ">
            <h3 className="text-center text-success fw-bold my-4">Cart</h3>
            <div className="yum-hub-card">
              <div className="mx-3  ">
                {data?.cart?.cartItems?.length > 0 &&
                  data?.cart?.cartItems?.map((item) =>
                    item?.items?.map((i) => (
                      <div>
                        <CartItems
                          item={i}
                          restaurantId={item?.restaurantId}
                          restaurantName={item?.restaurantName}
                          width={"80rem"}
                          imgHeight="200px"
                          handleCart={handleCart}
                          handleDeleteCartItem={handleDeleteCartItem}
                        />
                      </div>
                    ))
                  )}
                {data?.cart?.cartItems?.length > 0 ? (
                  <>
                    <p className="border-top border-3 border-success"></p>
                    <div className="d-flex justify-content-between text-success">
                      <h4 className="fw-bold ">Subtotal</h4>
                      <h4 className="mx-4 fw-bold">${data?.cart?.total}</h4>
                    </div>
                    <div className="text-center mb-4 d-flex flex-wrap justify-content-center">
                      <Nav.Link
                        as={Link}
                        className="checkout-btn my-2"
                        to="/checkout"
                      >
                        Go to checkout
                      </Nav.Link>

                      <Button
                        className="checkout-btn bg-danger mx-3 my-2"
                        onClick={() => setShowModal(true)}
                      >
                        Empty cart
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center my-5">
                    <div className="d-flex  justify-content-center align-items-center  mb-2">
                      <h5 className="fw-bold">Cart Is Empty</h5>
                    </div>
                    <a href="/restaurants" className="text-success fw-bold">
                      Go Back To Restaurants
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CartPopup
            show={showModal}
            closebutton={true}
            submitButtonName="Ok"
            handleClose={handleClose}
            handlePopup={handleEmptyCart}
            body="Are you sure you want to delete the items currently in your cart?"
          />
        </>
      )}
    </>
  );
};

export default Cart;
