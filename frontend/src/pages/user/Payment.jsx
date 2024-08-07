import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap"; // Assuming you are using react-bootstrap
import { ADD_PAYMENT, PAYMENT } from "../../services/graphql/auth";
import Navbar from "../../components/navbar";
import AddressCard from "../../components/AddressCard";
import PaymentCard from "../../components/PaymentCard";

const Payment = () => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    nickName: "",
    expiry: "",
    securityCode: "",
    zipCode: "",
    country: "",
  });

  const [addNew, setAddNew] = useState(false);
  const { data } = useQuery(PAYMENT);
  const [addPayment] = useMutation(ADD_PAYMENT, {
    refetchQueries: [{ query: PAYMENT }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addPayment({
      variables: {
        payment: cardInfo,
      },
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  return (
    <>
      <Navbar />
      <h3 className="text-center my-4 text-success">Payment</h3>
      <div className="text-center mx-3">
        <Button onClick={() => setAddNew(true)}>Add New</Button>
      </div>
      {data?.payment?.length > 0
        ? data?.payment?.map((res) => <PaymentCard payment={res} />)
        : null}
      {addNew ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="Enter card number"
                value={cardInfo.cardNumber}
                onChange={handleInputChange}
                autoComplete="cc-number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                name="nickName"
                placeholder="Enter cardholder name"
                value={cardInfo.nickName}
                onChange={handleInputChange}
                autoComplete="cc-name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="text"
                name="expiry"
                placeholder="MM/YYYY"
                value={cardInfo.expiry}
                onChange={handleInputChange}
                autoComplete="cc-exp-month"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                name="securityCode"
                placeholder="CVV"
                value={cardInfo.securityCode}
                onChange={handleInputChange}
                autoComplete="cc-csc"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                placeholder="Country"
                value={cardInfo.country}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                placeholder="ZipCode"
                value={cardInfo.zipCode}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>{" "}
        </div>
      ) : null}
    </>
  );
};

export default Payment;
