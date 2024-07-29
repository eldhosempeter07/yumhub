import React from "react";
import { Button, Modal } from "react-bootstrap";

const CartPopup = ({
  show,
  handleClose,
  handlePopup,
  body,
  closebutton,
  submitButtonName,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add To Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <div className="m-3 text-end">
        {closebutton ? (
          <Button className="bg-secondary" onClick={handleClose}>
            Cancel
          </Button>
        ) : null}
        <Button
          variant={`${
            body === "Post Created Sucessfully" ? "success" : "danger"
          }`}
          className="mx-2"
          onClick={handlePopup}
        >
          {submitButtonName}
        </Button>
      </div>
    </Modal>
  );
};

export default CartPopup;
