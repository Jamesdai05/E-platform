import { Col, Row } from "react-bootstrap";
import Product from "./Product";

const Productlist = ({ products }) => {
  return (
    <Row>
      {products.map((product) => (
        <Col key={product._id} xl={3} lg={4} md={6} sm={12}>
          <Product key={product._id} {...product} />
        </Col>
      ))}
    </Row>
  );
};
export default Productlist;
