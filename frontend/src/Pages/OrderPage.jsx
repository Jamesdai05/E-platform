import { Button, Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Loader from "../components/Loader.jsx";
import { useDispatch } from "react-redux";
import { useGetOrderDetailsQuery } from "../slices/orderSlice.js";


const OrderPage = () => {
  const {id:orderId}=useParams();

  const {data:order,refetch,isLoading,error}=useGetOrderDetailsQuery(orderId)


  console.log(order)
  return (
    <div>OrderPage</div>
  )
}
export default OrderPage