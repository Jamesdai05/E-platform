// import { useState } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/productsSlice.js";
import Loader from "./Loader.jsx";
import Message from "./Message.jsx";
import { Link } from "react-router-dom";



export const ProductCarousel = () => {
  const {data:products,isLoading,error}=useGetTopProductsQuery();

  return (
    <>
      {isLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.meesage || error?.error}</Message>
      ) : (
        <Carousel className="container" pause="hover">
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} text="top product" alt="product" fluid />
                <Carousel.Caption className="carousel-caption">
                  <h3>{products.name}(${product.price})</h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
}

export default ProductCarousel;