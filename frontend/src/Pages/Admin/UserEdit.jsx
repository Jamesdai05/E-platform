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
  console.log(user);
  const handleUpdate=async(e)=>{
    e.preventDefault();
    // console.log("Update");

    const updatedUser={
      userId,
      name,
      email,
      isAdmin,
    };
    try {
      await updateUser(updatedUser).unwrap();
      refetch();
      toast.success("User is updated!");
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
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
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>
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