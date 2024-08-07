import Card from "react-bootstrap/Card";
function PaymentCard({ payment }) {
  const { cardNumber, expiry, country, zipCode, nickName } = payment;
  return (
    <Card className="mx-auto my-2" style={{ maxWidth: "700px" }}>
      <div className="px-0 border border-3 px-4 pt-4 pb-3 rounded mt-4 mx-5 d-flex justify-content-between">
        <div className="fw-bold">
          <p className="fw-bold cart-item-name text-success">{nickName}</p>
          <p className="cart-item my-3 ">
            <i className="bi bi-credit-card-fill text-secondary mx-2 "></i>
            {cardNumber}
          </p>
          <p className="cart-item my-3">
            <i className="bi bi-calendar-check-fill text-secondary mx-2 "></i>

            {expiry}
          </p>
          <p className="cart-item my-3">
            <i className="bi bi-house-fill text-secondary mx-2 "></i>
            {zipCode}, {country}
          </p>
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <p className="cart-item-delete text-success mx-3">
            <i class="bi bi-pencil-square"></i>{" "}
          </p>
          <p className="cart-item-delete ">
            <i className="bi bi-trash3-fill"></i>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default PaymentCard;
