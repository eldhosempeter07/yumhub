import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADDRESS,
  ADDRESS_BY_ID,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
} from "../../services/graphql/auth";
import Navbar from "../../components/navbar";
import AddressCard from "../../components/AddressCard";

const Address = () => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    name: "",
    primary: false, // Initialize primary field
  });
  const [isEdit, setIsEdit] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [id, setId] = useState(null);
  const { data } = useQuery(ADDRESS);
  const {
    data: addressInfo,
    loading,
    refetch,
  } = useQuery(ADDRESS_BY_ID, {
    variables: { id },
    skip: id === null,
    onCompleted: (data) => {
      setAddress(data?.addressById);
    },
  });

  const [addAddress] = useMutation(ADD_ADDRESS, {
    refetchQueries: [{ query: ADDRESS }],
  });
  const [updateAddress] = useMutation(UPDATE_ADDRESS, {
    refetchQueries: [{ query: ADDRESS }],
  });

  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    refetchQueries: [{ query: ADDRESS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (addNew) {
      addAddress({
        variables: {
          address: {
            ...address,
            primary: address?.primary == null ? false : address?.primary,
          },
        },
      });
      setAddNew(false);
    } else {
      updateAddress({
        variables: {
          address,
        },
      });
      setIsEdit(false);
    }
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setAddress({ ...address, [name]: checked });
    } else {
      setAddress({ ...address, [name]: value });
    }
  };

  const toggleAddNew = () => {
    setAddNew(!addNew);
    resetForm();
  };

  const resetForm = () => {
    setAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      name: "",
      primary: false,
    });
    setId(null);
    setIsEdit(false);
  };

  const handleEdit = (id) => {
    setId(id);
    setIsEdit(true);
    refetch();
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
          <h3 className="text-center my-4 text-success fw-bold">Address</h3>
          <div className="text-center mx-3">
            <Button onClick={toggleAddNew}>Add New</Button>
          </div>
          {!loading && data?.address?.length > 0 ? (
            data?.address?.map((res) => (
              <AddressCard
                key={res.id}
                address={res}
                handleId={handleEdit}
                deleteAddress={deleteAddress}
              />
            ))
          ) : (
            <div className="d-flex justify-content-center align-items-center fw-bold mb-2 mt-5">
              <h5>No Address Added</h5>
            </div>
          )}
          {(addNew || isEdit) && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Form onSubmit={handleSubmit} className="mx-2">
                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={address.name || addressInfo?.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">
                    Street
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={address.street || addressInfo?.street}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city || addressInfo?.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">
                    Country
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={address.country || addressInfo?.country}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">
                    State
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state || addressInfo?.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-success fw-bold">
                    Zip Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={address.zipCode || addressInfo?.zipCode}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="primary-checkbox"
                    label="Primary"
                    name="primary"
                    checked={address.primary}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <div className="text-center">
                  <Button variant="primary" type="submit" className="my-2">
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={toggleAddNew}
                    className="my-2 mx-3"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Address;
