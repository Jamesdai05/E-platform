import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useSelector } from "react-redux";
import {
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useDeliveredorderMutation,
} from "../slices/orderSlice.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const OrderPage = () => {
    const { id: orderId } = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliveredorderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPayPalClientIdQuery();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
            // to confirm the clientId is there.
            console.log(
                "Loading PayPal script with client ID:",
                paypal.clientId
            );
            const loadPaypalScript = async () => {
                try {
                    paypalDispatch({
                        type: "resetOptions",
                        value: {
                            "client-id": paypal.clientId,
                            currency: "USD",
                            intent: "capture",
                        },
                    });
                    paypalDispatch({
                        type: "setLoadingStatus",
                        value: "pending",
                    });
                } catch (error) {
                    console.error("Error loading PayPal script:", error);
                    toast.error(
                        "Failed to load PayPal. Please refresh the page."
                    );
                }
            };

            if (order && !order.isPaid) {
                loadPaypalScript();
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    const onApprove = async function (data, actions) {
        // console.log("PayPal onApprove called with data:", data);
        try {
            const details = await actions.order.capture();
            console.log("PayPal capture successful:", details);

            await payOrder({ orderId, details }).unwrap();
            refetch();
            toast.success("Payment successful!");
        } catch (error) {
            console.error("Payment processing error:", error);
            toast.error(
                error?.data?.message ||
                    error?.message ||
                    "Payment failed. Please try again."
            );
        }
    };

    function onError(err) {
        console.error("PayPal error:", err);
        toast.error(`PayPal error: ${err.message || "Unknown error occurred"}`);
    }

    function createOrder(data, actions) {
        console.log("Creating PayPal order with amount:", order.totalPrice);
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: order.totalPrice.toString(),
                            currency_code: "USD",
                        },
                        description: `Order ${order._id}`,
                    },
                ],
                intent: "CAPTURE",
            })
            .then((orderId) => {
                console.log("PayPal order created with ID:", orderId);
                return orderId;
            })
            .catch((error) => {
                console.error("Error creating PayPal order:", error);
                throw error;
            });
    }

    // Test function for development
    async function onApproveTest() {
        try {
            await payOrder({ orderId, details: { payer: {} } }).unwrap();
            refetch();
            toast.success("Test payment successful!");
        } catch (error) {
            console.error("Test payment error:", error);
            toast.error(error?.data?.message || error?.message);
        }
    }
    const handleDeliver = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order is delivered!", { position: "top-center" });
        } catch (error) {
            toast.error(error?.data?.message || error?.message, {
                position: "top-center",
            });
        }
    };

    const style = { textDecoration: "none" };
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
                                        {order.shippingAddress.address},
                                        {order.shippingAddress.city}
                                        <br />
                                        {order.shippingAddress.country}{" "}
                                        {order.shippingAddress.postalCode}
                                    </p>
                                    {order.isDelivered ? (
                                        <Message variant="success">
                                            Order is delivered on{" "}
                                            {order.deliveredAt}
                                        </Message>
                                    ) : (
                                        <Message variant="danger">
                                            Not Delivered
                                        </Message>
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
                                        <Message variant="danger">
                                            Not Paid
                                        </Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image
                                                        src={item.image}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to={`/product/${item.product}`}
                                                        style={style}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} =
                                                    ${item.qty * item.price}
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
                                            {loadingPay && <Loader />}
                                            {isPending ? (
                                                <Loader />
                                            ) : (
                                                <>
                                                    <div>
                                                        {/* Development test button */}
                                                        {process.env
                                                            .NODE_ENV ===
                                                            "development" && (
                                                            <Button
                                                                onClick={
                                                                    onApproveTest
                                                                }
                                                                style={{
                                                                    marginBottom:
                                                                        "10px",
                                                                }}
                                                                variant="outline-secondary"
                                                                size="sm"
                                                            >
                                                                Test Pay Order
                                                                (Dev Only)
                                                            </Button>
                                                        )}
                                                        <div>
                                                            <PayPalButtons
                                                                key={`paypal-${order._id}`}
                                                                createOrder={
                                                                    createOrder
                                                                }
                                                                onApprove={
                                                                    onApprove
                                                                }
                                                                onError={
                                                                    onError
                                                                }
                                                                onCancel={() => {
                                                                    console.log(
                                                                        "PayPal payment cancelled"
                                                                    );
                                                                    toast.info(
                                                                        "Payment cancelled"
                                                                    );
                                                                }}
                                                                style={{
                                                                    layout: "vertical",
                                                                    color: "gold",
                                                                    shape: "rect",
                                                                    label: "paypal",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </ListGroup.Item>
                                    )}
                                    {loadingDeliver && <Loader />}
                                    {userInfo &&
                                        userInfo.isAdmin &&
                                        order.isPaid &&
                                        !order.isDelivered && (
                                            <ListGroup.Item>
                                                <Button
                                                    className="btn btn-block"
                                                    type="button"
                                                    onClick={handleDeliver}
                                                >
                                                    Mark as Delivered
                                                </Button>
                                            </ListGroup.Item>
                                        )}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};
export default OrderPage;
