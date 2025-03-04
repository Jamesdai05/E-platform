import { useEffect, useState } from "react";
import Productlist from "../components/Productlist.jsx";
// import products from "../products";
import axios from 'axios';



const Home = () => {

  const [products,setProducts]=useState([])
  const productsUrl="api/products"

  useEffect(()=>{
    const dataFetch = async () => {
      const { data } = await axios.get(productsUrl);
      console.log(data);
      setProducts(data);
    };
    dataFetch()
  },[])

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <h1>Latest Products</h1>
      <Productlist products={products} style={style} />
    </>
  );
};

export default Home;
