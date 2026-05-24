// import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import Productlist from "../components/Productlist.jsx";
import { useGetProductsQuery, useGetTopProductsQuery } from "../slices/productsSlice.js";
// import products from "../products";
// import axios from 'axios';
import Message from "../components/Message.jsx";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";



const Home = () => {
    const {keyword,pageNumber}=useParams();
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
  const { data, isLoading:isLoadingProducts, error:productError } = useGetProductsQuery({keyword,pageNumber});
  // carousel products
  const {
      data: carouselData,
      isLoading: isLoadingCarousel,
      error: carouselError ,
 } = useGetTopProductsQuery();
  // console.log(data)
  // combined loading state
  const isLoading = isLoadingProducts || isLoadingCarousel;
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  console.log("carouselData:", carouselData)
  return (
      <>
          {isLoading ? (
              <Loader />
          ) : productError || carouselError ? (
              <Message>
                  {productError?.data?.message ||
                      productError?.error ||
                      carouselError?.data?.message ||
                      carouselError?.error}
              </Message>
          ) : (
              <>
                  <ProductCarousel products={carouselData || []} />
                  <h1>Latest Products</h1>
                  <Productlist products={data.products} style={style} />
                  <Paginate
                      pages={data.pages}
                      page={data.page}
                      keyword={keyword ? keyword : ""}
                  />
              </>
          )}
      </>
  );
};

export default Home;
