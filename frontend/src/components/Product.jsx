import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ name, rating, numReviews, price, image,_id}) => {
  return (
    <Card className="my-3 p-1 rounded">
      <Link to={`/product/${_id}`}>
        <Card.Img
          variant="top"
          src={image}
          style={{ height: "15rem", objectFit: "contain" }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${_id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div" className="title">
            <b>{name}</b>
          </Card.Title>
        </Link>
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
