import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/helper";
function FavouriteCard({ item, imgHeight }) {
  const { name, category, price, description, imageURL } = item;
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
    <Card className="mx-auto my-4 ">
      <div className="d-flex flex-wrap justify-content-center w-100">
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
        <div className="px-0 w-75 mt-4 mx-3">
          <span className="fw-bold cart-item-name text-success">{name}</span>
          <div className=" d-flex justify-content-between fw-bold flex-wrap">
            <p className="cart-item my-3">{category}</p>
            <p className="cart-item my-3">$ {price} </p>
          </div>
          <h6 className="fw-bold text-success">{description}</h6>
        </div>
      </div>
    </Card>
  );
}

export default FavouriteCard;
