import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import {
  Accordion,
  Badge,
  Card,
  Col,
  Form,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  ADDRESS,
  CART,
  CREATE_ORDER,
  PAYMENT,
  UPDATE_ADDRESS,
} from "../../services/graphql/auth";
import { useMutation, useQuery } from "@apollo/client";
import CartItems from "../../components/CartItems";
import { getBackendUrl } from "../../utils/helper";

const Checkout = () => {
  const navigate = useNavigate();
  const [isAddressExist, setIsAddressExist] = useState(false);
  const [address, setAddress] = useState(null);
  const [addInstruction, setAddInstruction] = useState(false);
  const [total, setTotal] = useState(0);
  const [instructions, setInstructions] = useState("Meet at my door");
  const [id, setId] = useState(null);
  const { data: addressData, loading } = useQuery(ADDRESS);

  const { data: cartData } = useQuery(CART, {
    onCompleted: (cartData) => {
      setId(cartData?.cart?.restaurantId);
      setTotal(parseFloat(cartData?.cart?.total) + 3.99 + 4.0);
    },
  });

  useEffect(() => {
    const primary = addressData?.address?.find((addr) => addr.primary);
    setAddress(primary?.id);
  }, [addressData]);

  const { data: paymentData } = useQuery(PAYMENT);

  const [updateAddress] = useMutation(UPDATE_ADDRESS, {
    refetchQueries: [{ query: ADDRESS }],
  });

  useEffect(() => {
    setIsAddressExist(!!addressData?.address[0]?.id);
  }, [addressData]);

  const [createOrder] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: CART }],
  });

  const handleInputChange = (event, addData) => {
    updateAddress({
      variables: {
        address: { ...addData, primary: true },
      },
    });
  };

  const handlePlaceOrder = () => {
    if (isAddressExist) {
      createOrder({
        variables: {
          order: {
            addressId: address,
            paymentId: paymentData?.payment[0]?.id,
            promoCode: "",
            subTotal: cartData?.cart?.total.toString(),
            deliveryFee: "3.99",
            tax: "4.00",
            totalAmount: total.toString(),
            instructions,
            orderItems: cartData?.cart?.cartItems,
          },
        },
      }).catch((error) => {
        console.error("Error creating payment intent:", error);
      });
    }
  };

  const backendUrl = getBackendUrl();

  const handleCheckout = () => {
    fetch(`${backendUrl}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            name: "YumHub",
            price: total.toFixed(0),
            quantity: 1,
          },
        ],
      }),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const json = await res.json();
        return await Promise.reject(json);
      })
      .then(async ({ url }) => {
        handlePlaceOrder();
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  if (cartData?.cart.totalCount == 0) {
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" />
    </div>;
    return navigate("/cart");
  }

  return (
    <>
      <Navbar />
      <Row>
        <Col lg={6} className="checkout-delivery-card">
          <Card className="border my-4 py-5 px-4 rounded-4 bg-white">
            <Card.Body>
              <h4 className="fw-bold">Delivery details</h4>

              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h2 className="fw-bold text-secondary">
                      <i className="bi bi-cart4"></i>
                    </h2>
                    <h5 className="mt-2 mx-4">Address</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    {addressData?.address?.map((addData) => (
                      <div key={addData?.id} className=" pt-5">
                        <h5>{addData?.street},</h5>
                        <h5 className="text-secondary">
                          {addData?.city}, {addData?.state}, {addData?.country},{" "}
                          {addData?.zipCode}
                        </h5>
                        {!addData?.primary ? (
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              id="primary-checkbox"
                              label="Set As Primary"
                              name="primary"
                              onChange={(event) =>
                                handleInputChange(event, addData)
                              }
                            />
                          </Form.Group>
                        ) : (
                          <Badge className="mb-2" bg="success">
                            Primary
                          </Badge>
                        )}
                        <p className="border-top border-4"></p>
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <p className="border-top border-1"></p>

              <Card.Text className="d-flex mt-4">
                <h3>
                  <i className="bi bi-person-fill text-secondary"></i>
                </h3>
                <div className="mx-4">
                  <h5>Meet at my door</h5>
                  <h5
                    className="text-success cursor-pointer"
                    onClick={() => setAddInstruction(true)}
                  >
                    Add delivery instruction
                  </h5>
                  {addInstruction && (
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Control
                        as="textarea"
                        rows={5}
                        style={{ width: "30rem" }}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </Form.Group>
                  )}
                </div>
              </Card.Text>

              <p className="border-top border-1"></p>

              {/* <h4 className="fw-semibold">Payment</h4>
              <Card.Text className="d-flex mt-4">
                <h3>
                  <i className="bi bi-credit-card-fill text-secondary"></i>
                </h3>
                {paymentData?.payment?.map((payData) => (
                  <div key={payData?.id} className="mx-4">
                    <h5>Visa</h5>
                    <h5>****{payData?.cardNumber.slice(14)}</h5>
                  </div>
                ))}
              </Card.Text> */}

              {!isAddressExist && (
                <p className="text-center fs-5 text-danger fw-bold">
                  Please Add the Address
                </p>
              )}

              <div className="text-center my-5">
                <Nav.Link
                  className="checkout-btn text-white"
                  onClick={handleCheckout}
                  disabled={!isAddressExist}
                >
                  Pay Now
                </Nav.Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5} sm={12} className="checkout-order-details">
          <Card className="checkout-order-card border my-4 py-4 px-3 rounded-4 bg-white">
            <Card.Body>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h2 className="fw-bold text-secondary">
                      <i className="bi bi-cart4"></i>
                    </h2>
                    <h5 className="mt-2 mx-4">
                      Cart summary
                      <span className="mx-2">
                        ({cartData?.cart?.totalCount}{" "}
                        {cartData?.cart?.totalCount === 1 ? "item" : "items"})
                      </span>
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    {cartData?.cart?.cartItems?.map((item) =>
                      item?.items?.map((i) => (
                        <div key={i.id}>
                          <CartItems
                            item={i}
                            restaurantName={item?.restaurantName}
                            width={"60rem"}
                            imgHeight="100px"
                            checkout={true}
                          />
                        </div>
                      ))
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <p className="border-top border-4"></p>

              <h3 className="fw-semibold">Promotion</h3>
              <Card.Text className="d-flex mt-4">
                <h2>
                  <i className="bi bi-cash text-secondary"></i>
                </h2>
                <div className="mx-4 mt-2">
                  <h5>Add promo code</h5>
                </div>
              </Card.Text>
              <p className="border-top border-4"></p>

              <h4 className="fw-semibold">Order total</h4>
              <Card.Text className="mt-4 text-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <h5>Subtotal</h5>
                  <h5>${cartData?.cart?.total?.toFixed(2)}</h5>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <h5>Delivery Fee</h5>
                  <h5>$3.99</h5>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <h5>Tax & Other Fees</h5>
                  <h5>$4.00</h5>
                </div>
                <div className="d-flex justify-content-between text-black">
                  <h4>Total</h4>
                  <h4>${total.toFixed(0)}</h4>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Checkout;
