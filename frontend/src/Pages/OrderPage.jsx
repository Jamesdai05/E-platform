import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useSelector } from "react-redux";
import {
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    useCreatePayPalPaymentMutation,
    useCapturePayPalPaymentMutation,
    useDeliveredorderMutation,
} from "../slices/orderSlice.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// Shared so a failed payment shows one toast, not one each from us and from PayPal
const PAYPAL_ERROR_TOAST = "paypal-error";

const OrderPage = () => {
    const { id: orderId } = useParams();

    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetOrderDetailsQuery(orderId);

    const [createPayPalPayment] = useCreatePayPalPaymentMutation();

    const [capturePayPalPayment, { isLoading: loadingPay }] =
        useCapturePayPalPaymentMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliveredorderMutation();

    const [{ isInitial, isResolved, isRejected }, paypalDispatch] =
        usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPayPalClientIdQuery();

    const { userInfo } = useSelector((state) => state.auth);

    const paypalUnavailable =
        errorPayPal || isRejected || (paypal && !paypal.clientId);

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
                            // intent: "capture",
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

            // Load once: reloading would rebuild the buttons mid-payment
            if (order && !order.isPaid && !order.stockReleased && isInitial) {
                loadPaypalScript();
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch, isInitial]);

    const onApprove = async function () {
        try {
            const result = await capturePayPalPayment(orderId).unwrap();
            refetch();
            if (result.isPaid) {
                toast.success("Payment successful!");
            } else {
                toast.info(result.message);
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            refetch();
            toast.error(
                error?.data?.message ||
                    error?.message ||
                    "Payment failed. Please try again."
            );
        }
    };

    function onError(err) {
        console.error("PayPal error:", err);
        toast.error(
            `PayPal error: ${err.message || "Unknown error occurred"}`,
            { toastId: PAYPAL_ERROR_TOAST }
        );
    }

    async function createOrder() {
        try {
            const { id } = await createPayPalPayment(orderId).unwrap();
            return id;
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            const message =
                error?.data?.message || "Could not start the PayPal payment.";
            toast.error(message, { toastId: PAYPAL_ERROR_TOAST });
            // The backend may have just found an earlier payment for this order
            refetch();
            throw new Error(message);
        }
    }

    const handleDeliver = async () => {
        try {
            await deliverOrder(orderId).unwrap();
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
                                        {order.user?.name ?? "Deleted user"}
                                    </p>
                                    <p>
                                        <b>Email: </b>
                                        {order.user?.email ?? "N/A"}
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
                                            {order.stockReleased ? (
                                                <Message variant="danger">
                                                    This order has expired
                                                    because it was not paid in
                                                    time. Please place a new
                                                    order.
                                                </Message>
                                            ) : paypalUnavailable ? (
                                                <Message variant="danger">
                                                    PayPal is unavailable right
                                                    now. Please refresh the page
                                                    or try again later.
                                                </Message>
                                            ) : !isResolved ? (
                                                <Loader />
                                            ) : (
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
