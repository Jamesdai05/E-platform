import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useSelector } from "react-redux";
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useDeliveredorderMutation } from "../slices/orderSlice.js";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const OrderPage = () => {
  const {id:orderId}=useParams();

  const {data:order,refetch,isLoading,error}=useGetOrderDetailsQuery(orderId);

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

  const [deliverOrder, {isLoading: loadingDeliver }] =useDeliveredorderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data:paypal,
    isLoading: loadingPayPal,
    error:errorPayPal,
  }  = useGetPayPalClientIdQuery();

  const {userInfo}=useSelector(state=>state.auth)


  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      console.log("Loading PayPal script with client ID:", paypal.clientId);
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
      loadPaypalScript();
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);



  const onApprove= async function(data,actions){
    return actions.order.capture().then(async function(details){
      try {
        await payOrder({orderId,details});
        refetch();
        toast.success("Payment successful")
      } catch (error) {
        toast.error(error?.data?.message || error?.message)
      }
    })
  }

  async function onApproveTest() {
    await payOrder({orderId,details:{payer:{}}});
          refetch();
          toast.success("Payment successful")
  }
  function onError(err) {
     toast.error(err.message);
  }
  function createOrder(data,actions) {
    return actions.order.create({
      purchase_units:[
        {
          amount:{
            value:order.totalPrice,
          },
        },
      ],
    }).then(orderId=>{
      return orderId;
    })
  }

  const handleDeliver=async()=>{
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order is delivered!")
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  }


  const style={textDecoration:"none",}
  // console.log(order)
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
                    {order.shippingAddress.country}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
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
                    <Message variant="success">
                      Order is paid on {order.paidAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
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
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {isLoading && <Loader />}
                      {isPending ? (
                        <Loader />
                      ) : (
                        <>
                          <div>
                            <Button
                              onClick={onApproveTest}
                              style={{ marginBottom: "10px" }}
                            >
                              Test pay order
                            </Button>
                            <div>
                                <PayPalButtons
                                  createOrder={createOrder}
                                  onApprove={onApprove}
                                  onError={onError}
                                />
                            </div>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  )}
                  {loadingDeliver && <Loader/>}
                  {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                      <Button className="btn btn-block" type="button" onClick={handleDeliver}>Mark as Delivered</Button>
                    </ListGroup.Item>
                  ) }
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