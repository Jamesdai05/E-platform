import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import FormContainer from "../../components/FormContainer.jsx";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
useUploadProductImageMutation } from "../../slices/productsSlice.js";



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
  const [uploadProductImage,{isloading:loadingImage}] = useUploadProductImageMutation();

  const navigate=useNavigate();

  // console.log(product);

  const handleUpdate=async(e)=>{
    e.preventDefault();
    // console.log("Update");
    const updatedProduct = {
        productId,
        name,
        brand,
        category,
        price,
        countInStock,
        description,
        image,
      };

      try {
        await updateProduct(updatedProduct).unwrap();
        refetch();
        toast.success("Product is updated!");
        navigate("/admin/productList");
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }

    // const result=await updateProduct(updatedProduct);
    // if(!result.error){
    //   toast.success("Product is upadted!");
    //   navigate("/admin/productList");
    // }else{
    //   toast.error(result.error);
    // }

  }

  const handleUpload=async(e)=>{
    // console.log("upload!")
    // to check the data get in the frontend
    // console.log(e.target.files[0])
    const formData=new FormData();
    formData.append("image",e.target.files[0])

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      console.log(error.data);
      toast.error(error?.data?.message || error?.error);
    }
  }

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setImage(product.image);
    }
  }, [product]);


  return (
    <>
      <Link to="/admin/productList" className="btn btn-primary m-3">
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
          <Form onSubmit={handleUpdate}>
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
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the category"
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product brand"
                value={brand}
                name="brand"
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the stock"
                value={countInStock}
                name="stock"
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the description"
                value={description}
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                name="image"
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={handleUpload}
              />
            </Form.Group>
            {/* <h6>Image uploading tool will be settle later.</h6> */}
            {loadingImage && <Loader />}
            <Button className="my-2" type="submit">
              Update Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}
export default ProductEdit