import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useDispatch } from "react-redux";
import { useGetOrderDetailsQuery } from "../slices/orderSlice.js";


const OrderPage = () => {
  const {id:orderId}=useParams();

  const {data:order,refetch,isLoading,error}=useGetOrderDetailsQuery(orderId)

  const style={t0extDecoration:"none",}
  console.log(order)
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <h1>{order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <b>Name: </b>
                    {order.user.name}
                  </p>
                  <p>
                    <b>Email: </b>
                    {order.user.email}
                  </p>
                  <p>
                    <b>Address: </b>
                    {order.shippingAddress.address},{order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.coutry}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="succes">
                      Order is delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>PaymentMethod</h2>
                  <p>{order.paymentMethod}</p>
                  {order.isPaid ? (
                    <Message variant="succes">
                      Order is paid on {order.paidAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`} style={style}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary:</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>ItemsPrice:</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>TaxPrice:</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>ShippingPrice:</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>TotalPrice:</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {error && (
                      <Message variant="danger">
                        {error?.data?.message || error?.error}
                      </Message>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Place Order
                    </Button>
                    {isLoading && <Loader />}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
export default OrderPage