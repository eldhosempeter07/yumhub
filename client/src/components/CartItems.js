import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/helper";
function CartItems({
  item,
  width,
  imgHeight,
  checkout,
  handleCart,
  handleDeleteCartItem,
  restaurantName,
  restaurantId,
}) {
  const { name, description, price, rating, category, id, count, imageURL } =
    item;
  const [countValue, setCountValue] = useState(0);
  useEffect(() => {
    setCountValue(count);
  }, [item]);

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

  return (
    <Card className="mx-1 my-3 border border-3 rounded my-5 py-3 px-2 ">
      <div className="text-end">
        <p className="text-success fw-bold">{restaurantName}</p>
      </div>
      <div className="d-flex flex-wrap justify-content-center">
        <div className="img-container">
          <Card.Img
            variant="top"
            src={
              imageURL != null
                ? imageUrl?.replace("BIRIYANI.jpg", imageURL)
                : require(`../utils/Pics/dummy.jpg`)
            }
            height={imgHeight}
            width={"100px"}
          />
        </div>
        <div className={`px-0 checkout-item ${checkout ? null : "mt-4"} mx-5`}>
          <span className="fw-bold cart-item-name text-success">{name}</span>
          <div className=" d-flex flex-wrap justify-content-between fw-bold">
            <p className="cart-item my-3">{category}</p>
            <p className="cart-item my-3">$ {price} </p>
            {checkout ? (
              <p className="cart-item my-3">{countValue}</p>
            ) : (
              <>
                <div className="d-flex my-2">
                  <p
                    className="count-value"
                    onClick={() => {
                      countValue == 1
                        ? handleDeleteCartItem(id)
                        : handleCart({ id, count: -1 });
                    }}
                  >
                    -
                  </p>
                  <input
                    className="count-input mx-2"
                    value={countValue}
                    disabled
                  />
                  <p
                    className="count-value"
                    onClick={() => handleCart({ id, count: 1 }, restaurantId)}
                  >
                    +
                  </p>
                </div>
                <p
                  className="cart-item-delete cursor-pointer"
                  onClick={() => handleDeleteCartItem(id)}
                >
                  <i className="bi bi-trash3-fill"></i>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItems;
