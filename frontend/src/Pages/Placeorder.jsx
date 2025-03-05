import { Button, Col, Image, ListGroup, Row, Card } from "react-bootstrap";
import CheckoutComponent from "../components/CheckoutComponent.jsx";





const Placeorder = () => {
  return (
    <>
      <CheckoutComponent step1 step2 step3 />
      <Row>
        <Col md={8}>Col</Col>
        <Col md={4}>Col</Col>
      </Row>
    </>
  );
};
export default Placeorder;
