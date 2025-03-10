import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import { toast } from "react-toastify";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice.js";



const UserEdit = () => {

  const {id:userId}=useParams();
   const navigate=useNavigate();

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [isAdmin,setIsAdmin]=useState(false);

  const {data:user, refetch,isLoading, error}=useGetUserDetailsQuery(userId);

  const [updateUser,{isLoading:loadingUpdateUser}] =useUpdateUserMutation();

  const handleUpdate=()=>{
    console.log("Update");
  }

  useEffect(()=>{
    if(user){
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }

  },[user])

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-primary m-3">
        Go Back
      </Link>

      <FormContainer>
        <h2>Update User</h2>
        {loadingUpdateUser && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error?.error}
          </Message>
        ) : (
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user name"
                value={name}
                name="user-name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user email"
                value={email}
                name="price"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Label>isAdmin</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the category"
                value={isAdmin}
                name="category"
                onChange={(e) => setIsAdmin(e.target.value)}
              />
            </Form.Group>

            {/* <h6>Image uploading tool will be settle later.</h6> */}

            <Button className="my-2" type="submit">
              Update User
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}
export default UserEdit