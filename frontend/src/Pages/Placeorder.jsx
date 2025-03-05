import { Button, Col, Image, ListGroup, Row, Card } from "react-bootstrap";
import CheckoutComponent from "../components/CheckoutComponent.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { clearCartItems } from "../slices/cartSlice.js";
import { useCreateOrdersMutation } from "../slices/orderSlice.js";



const Placeorder = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const cart=useSelector(state=>state.cart);
  const {shippingAddress}=cart;

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod,cart,shippingAddress.address,navigate]);

  const [createOrders, {isLoading, error}]=useCreateOrdersMutation()

  const handleOrderSubmit = async() => {
    try {
      const res = await createOrders({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <CheckoutComponent step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                <strong>Address:</strong>
                <br />
                <i>
                  {cart.shippingAddress.address},{cart.shippingAddress.city}
                </i>
                <br />
                <i>
                  {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country}
                </i>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                <strong>PaymentMethod:</strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>CartItems:</strong>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty.</Message>
              ) : (
                <ListGroup>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item._id}`}
                            className="text-decoration-none hover:text-decoration-underline"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty}X${item.price}=${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TaxPrice:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>ShippingPrice:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>TotalPrice:</Col>
                  <Col>${cart.totalPrice}</Col>
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
                  disabled={cart.cartItems.length === 0}
                  onClick={handleOrderSubmit}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Placeorder;
