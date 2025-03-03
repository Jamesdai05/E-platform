import { Card } from "react-bootstrap";
import Rating from "./Rating";
// import { Link } from "react-router-dom";

const Product = ({ name, rating, numReviews, price, image}) => {
  return (
    <Card className="my-3 p-1 rounded">
      <Card.Img
        variant="top"
        src={image}
        style={{ height: "15rem", objectFit: "contain" }}
      />
      <Card.Body>
        <Card.Title as="div" className="title">
          <b>{name}</b>
        </Card.Title>
        <Card.Text as="div">
          <Rating
            value={rating}
            text={`${numReviews} Reviews`}
            className="mb-3"
          />
        </Card.Text>
        <Card.Text as="h4">${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default Product;
