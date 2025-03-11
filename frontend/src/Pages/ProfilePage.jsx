import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";
import { useUpdateprofileMutation } from "../slices/usersApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import { useGetmyordersQuery } from "../slices/orderSlice.js";
import Message from "../components/Message.jsx";
import { FaTimes } from "react-icons/fa";


const ProfilePage = () => {
  const [name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch=useDispatch();

  const {userInfo} = useSelector(state=>state.auth);
  // console.log(userInfo)
  useEffect(()=>{
    if(userInfo){
      setName(userInfo.name);
      setEmail(userInfo.email)
    }
  },[userInfo,userInfo.name,userInfo.email])

  const [updateProfile, {isLoading: loadingUpdateProfile}]=useUpdateprofileMutation();
  const {data:orders, isLoading, error } = useGetmyordersQuery();

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(password!==confirmPassword){
      toast.error("Passwords do not match!")
    }else{
      try {
        const res=await updateProfile({
          // _id:userInfo._id,
          // above is not needed as it is not in the controller.
          name,
          email,
          password}).unwrap();
        // to update the credentials
        dispatch(setCredentials(res))
        toast.success("Profile updated successfully.", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(error?.data?.Message || error?.error, {
          position: "top-center",
        });
      }
    }
  }


  return (
    <Row>
      <Col md={3}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="enter your name"
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="enter your email"
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="enter your password"
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              placeholder="confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="btn my-2">
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data.message || error?.error}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="secondary">Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
}
export default ProfilePage