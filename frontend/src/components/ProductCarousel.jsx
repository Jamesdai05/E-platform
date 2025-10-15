// import { useState } from "react";
import { Carousel } from "react-bootstrap";
// import { useGetTopProductsQuery } from "../slices/productsSlice.js";
// import Loader from "./Loader.jsx";
// import Message from "./Message.jsx";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

export const ProductCarousel = ({products}) => {
  // const { data: products, isLoading, error } = useGetTopProductsQuery();

  const style = {
    width: "800px",
    height: "520px",
    objectFit: "contain",
    display: "flex",
    justifyContent: "center",
    margin: "auto",
  };
  return (
    <>
      {/* {isLoading && <Loader />} */}
      {products && products.length>0 ? (
        <Carousel className="container" pause="hover">
          {products.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  style={style}
                  className="carousel-image"
                  variant="top"
                />
                <Carousel.Caption className="carousel-caption">
                  <h3>
                    {product.name}(${product.price})
                  </h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (<div>No products available for the carousel.</div>)}
    </>
  );
};

export default ProductCarousel;
