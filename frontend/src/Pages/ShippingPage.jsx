import { useState } from "react";
import FormContainer from "../components/FormContainer.jsx";
import CheckoutComponent from '../components/CheckoutComponent';
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {saveShippingAddress} from "../slices/cartSlice.js"

const ShippingPage = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const cart=useSelector(state=>state.cart);
  const {shippingAddress}=cart;


  const [address,setAddress]=useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");




  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    // console.log(cart.shippingAddress);
    navigate("/payment");
  }



  return (
    <FormContainer>
      <CheckoutComponent step1 step2 />
      <h1>Shipping Info</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your address"
            value={address}
            name="address"
            autoComplete="address"
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the city"
            value={city}
            name="city"
            autoComplete="city"
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>PostalCode</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the postalCode"
            value={postalCode}
            name="postalCode"
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the country"
            value={country}
            name="country"
            autoComplete="country"
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="btn btn-lg my-4"
          // disabled={isLoading}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}
export default ShippingPage