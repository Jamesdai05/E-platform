import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader.jsx";
import { setCredentials } from "../slices/authSlice.js";
import { toast } from "react-toastify";
import { useRegistrationMutation } from "../slices/usersApiSlice.js";


const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registration, { isLoading }] = useRegistrationMutation();
  //get the user from the state
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchPara = new URLSearchParams(search); //methods for working with URL query strings
  // retrieve the query parameter redirect and fallback value
  const redirect = searchPara.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // add the email focus when page is loaded
  useEffect(() => {
    document.getElementById("email").focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate the form
    if (!email || !password || !confirmPassword ||!name) {
      toast.error("Please fill in all fields!");
      return;
    }else{
      try {
        const res = await registration({ email, password,name }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err?.error);
      }
    }
  };



  return (
    <FormContainer>
      <h1>Sign Up</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="name" className="my-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="my-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="btn btn-lg my-4"
          disabled={isLoading}
        >
          Sign Up
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? {" "}
          <Link
            className="fw-bold"
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
          >
            Log in
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};
export default Registration;
