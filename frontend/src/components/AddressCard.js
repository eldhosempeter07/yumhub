import Card from "react-bootstrap/Card";
import { useState } from "react";
import { Badge } from "react-bootstrap";

function AddressCard({ address, handleId, deleteAddress }) {
  const { street, city, state, zipCode, country, name, id, primary } = address;

  return (
    <Card className="mx-auto my-2" style={{ maxWidth: "800px" }}>
      <div className="px-0 border border-3 px-4 pt-4 mt-4 mx-5">
        <div className="fw-bold d-flex justify-content-between">
          <div>
            <div>
              <span className="fw-bold cart-item-name text-success">
                <i className="bi bi-house-fill text-secondary mx-2 "></i>
                {name}
              </span>
              {primary ? (
                <Badge className="mx-2" bg="success">
                  Primary
                </Badge>
              ) : null}
            </div>
            <p className="cart-item my-3">{street}</p>
            <p className="cart-item my-3">
              {city}, {state}, {country}, {zipCode}
            </p>
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <p
              className="cart-item-delete cursor-pointer text-success mx-3"
              onClick={() => handleId(id)}
            >
              <i className="bi bi-pencil-square"></i>{" "}
            </p>
            <p
              className="cart-item-delete cursor-pointer"
              onClick={() => deleteAddress({ variables: { addressId: id } })}
            >
              <i className="bi bi-trash3-fill"></i>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AddressCard;
