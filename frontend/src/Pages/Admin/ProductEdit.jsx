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
    }
  },[product])


  // console.log(product);


  return (
    <>
      <Link to="/admin/productlist" className="btn btn-primary m-3">
        Go Back
      </Link>

      <FormContainer>

        
      </FormContainer>

    </>
  )
}
export default ProductEdit