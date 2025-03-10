// import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import Productlist from "../components/Productlist.jsx";
import { useGetProductsQuery } from "../slices/productsSlice.js";
// import products from "../products";
// import axios from 'axios';
import Message from "../components/Message.jsx";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";



const Home = () => {
    const {pageNumber}=useParams();
  // const [products,setProducts]=useState([])
  // const productsUrl="api/products"

  // useEffect(()=>{
  //   const dataFetch = async () => {
  //     const { data } = await axios.get(productsUrl);
  //     // console.log(data);
  //     setProducts(data);
  //   };
  //   dataFetch()
  // },[])

  // const { data: products, isLoading, error } = useGetProductsQuery();
  const { data, isLoading, error } = useGetProductsQuery({pageNumber});
  // console.log(data)
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error?.error}</Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Productlist products={data.products} style={style} />
          <Paginate pages={data.pages} page={data.page} />
        </>
      )}
    </>
  );
};

export default Home;
