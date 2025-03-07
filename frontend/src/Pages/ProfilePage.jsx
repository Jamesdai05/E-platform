import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";
import { useUpdateprofileMutation } from "../slices/usersApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";


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

  const [updateProfile, {isLoading: loadingUpdateProfile}]=useUpdateprofileMutation()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(password!==confirmPassword){
      toast.error("Passwords do not match!")
    }else{
      try {
        const res=await updateProfile({_id:userInfo._id, name,email,password}).unwrap();
        // to update the credentials
        dispatch(setCredentials(res))
        toast.success("Profile updated successfully.")
      } catch (error) {
        toast.error(error?.data?.Message || error?.error)
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
          <Button type="submit" variant="primary" className="btn my-2">Update</Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}></Col>
    </Row>
  );
}
export default ProfilePage