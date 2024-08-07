import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/helper";
function MenuItems({
  item,
  width,
  imgHeight,
  handleCart,
  handleFavourite,
  isOpen,
  isHome,
}) {
  const navigate = useNavigate();
  const {
    name,
    description,
    price,
    rating,
    category,
    id,
    imageURL,
    restaurantId,
  } = item;

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

  const isAuthenticated = !!localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const addToCart = (item) => {
    if (!isAuthenticated || type !== "user") return navigate("/login");
    handleCart(item);
  };

  const addToFavourite = (id) => {
    if (!isAuthenticated || type !== "user") return navigate("/login");
    handleFavourite(id);
  };

  return (
    <Card style={{ width: `${width ? width : "13rem"}` }} className="mx-4 ">
      <div className="img-container">
        <Card.Img
          variant="top"
          src={imageUrl?.replace("BIRIYANI.jpg", item.imageURL)}
          height={imgHeight}
          width={"80px"}
          style={{ opacity: isOpen || isHome ? "100%" : "30%" }}
        />
        {isOpen || isHome ? (
          <>
            <span
              className="card-add"
              onClick={() =>
                addToCart({ item: { id, count: 1 }, restaurantId })
              }
            >
              ➕
            </span>
            <span
              className="card-favourite mx-2"
              onClick={() => addToFavourite(id)}
            >
              💚
            </span>
          </>
        ) : null}
      </div>
      <Card.Body className="px-0">
        <h5 className="fw-bold">
          {name}
          <span className="menu-rating">{`(${rating || 4.2})`}</span>
        </h5>
        <Card.Text className="mb-1">
          <span>$ {price} </span>
          <span>{category} </span>
        </Card.Text>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default MenuItems;
