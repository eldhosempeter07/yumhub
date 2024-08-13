import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { Badge, Col, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/helper";

function OrderCard({ order }) {
  const { orderItems, subTotal, tax, deliveryFee } = order;

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
    <>
      <div className="cart-container ">
        <div className="mx-auto overflow-hidden fav-container">
          <div className="mx-3">
            {orderItems?.length > 0 &&
              orderItems.map((item) => (
                <div
                  key={item.restaurantId}
                  className="border border-3 px-2 my-5 rounded"
                >
                  <Nav.Link
                    className="fw-bold cart-item-name text-success fs-4 mt-3 mx-3"
                    as={Link}
                    to={`/restaurant/${item?.restaurantId}`}
                  >
                    {item?.restaurantName}{" "}
                    <Badge
                      bg={`${
                        item?.status === "Declined" ? "danger" : "success"
                      } `}
                    >
                      {item?.status}
                    </Badge>
                  </Nav.Link>
                  {item.items.map((i) => (
                    <div key={i.id}>
                      <Card className="mx-3 my-5 ">
                        <Row className="d-flex flex-wrap justify-content-between">
                          <Col lg={3} className="img-container">
                            <Card.Img
                              variant="top"
                              src={imageUrl?.replace(
                                "BIRIYANI.jpg",
                                i?.imageURL
                              )}
                              height={"200px"}
                              width={"18rem"}
                            />
                          </Col>
                          <Col lg={8} className="px-0 ">
                            <div className=" d-flex flex-wrap justify-content-between mt-5 mx-2 fw-bold">
                              <p className="fw-bold cart-item-name mt-3 text-success">
                                {i?.name}
                              </p>
                              <p className="cart-item mt-3">{i?.count}</p>
                              <p className="cart-item mt-3">{i?.category}</p>
                              <p className="cart-item mt-3">$ {i?.price} </p>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderCard;
