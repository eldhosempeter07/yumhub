import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/helper";

function YumCard({ name, desc, width, imgHeight, imageURL }) {
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
    <Card style={{ width: `${width ? width : "13rem"}` }} className="mx-2">
      <Card.Img
        variant="top"
        src={
          imageURL != null
            ? imageUrl?.replace("BIRIYANI.jpg", imageURL)
            : require(`../utils/Pics/dummy.jpg`)
        }
        height={imgHeight}
        width={"80px"}
      />
      <Card.Body className="px-0">
        <h5 className="fw-bold text-success">{name}</h5>
        <Card.Text>{desc}</Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}

export default YumCard;
