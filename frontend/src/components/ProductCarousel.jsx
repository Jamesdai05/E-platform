// import { useState } from "react";
import { Carousel, Image } from "react-bootstrap";
// import { useGetTopProductsQuery } from "../slices/productsSlice.js";
// import Loader from "./Loader.jsx";
// import Message from "./Message.jsx";
import { Link } from "react-router-dom";

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
                <Image
                  src={product.image}
                  text="top product"
                  alt="product"
                  style={style}
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
