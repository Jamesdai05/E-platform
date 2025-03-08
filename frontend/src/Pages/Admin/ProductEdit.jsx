import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation } from "../../slices/productsSlice.js";



const ProductEdit = () => {
  const {id:productId}=useParams();


  const [name,setName]=useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {data:product,isLoading,refetch,error}=useGetProductDetailsQuery(productId);

  const [ updateProduct,{isLoading : loadingUpdate}] = useUpdateProductMutation();

  const navigate=useNavigate();

  useEffect(()=>{
    if(product){
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setDescription(product.image);
    }
  },[product])


  // console.log(product);


  return (
    <>
      <Link to="/admin/productlist" className="btn btn-primary m-3">
        Go Back
      </Link>

      <FormContainer>
        <h2>Update Product</h2>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error?.error}
          </Message>
        ) : (
          <Form>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                name="product-name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product price"
                value={price}
                name="price"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the category"
                value={category}
                name="category"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product brand"
                value={brand}
                name="brand"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the stock"
                value={stock}
                name="stock"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the description"
                value={description}
                name="description"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={image}
                name="image"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Form>
        )}
      </FormContainer>
    </>
  );
}
export default ProductEdit