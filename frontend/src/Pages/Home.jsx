// import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import Productlist from "../components/Productlist.jsx";
import { useGetProductsQuery, useGetTopProductsQuery, useGetProductsByPricesQuery } from "../slices/productsSlice.js";
// import products from "../products";
// import axios from 'axios';
import Message from "../components/Message.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
// import ProductFilter from "../components/ProductFilter";
import ProductFilter from "../components/ProductFilter";
import { Col, Row } from "react-bootstrap";


const Home = () => {
    const { keyword, pageNumber } = useParams();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const minPrice = searchParams.get("minPrice") || undefined;
    const maxPrice = searchParams.get("maxPrice") || undefined;

    const basePath = keyword ? `/search/${keyword}` : "/";

    // go back to page 1 wheneven the filter is changed
    const applyFilter = ({ minPrice, maxPrice }) => {
        const next = new URLSearchParams();
        if (minPrice) next.set("minPrice", minPrice);
        if (maxPrice) next.set("maxPrice", maxPrice);

        navigate({ pathname: basePath, search: next.toString() });  // to set the search to from number to string
    };

    const resetFilter = () => navigate(basePath);

    const isPriceFiltered = minPrice !== undefined || maxPrice !== undefined; // to test whether the price query param is defined

    const listQuery=useGetProductsQuery({keyword,pageNumber},{skip:isPriceFiltered})

    const priceQuery = useGetProductsByPricesQuery({ minPrice, maxPrice,pageNumber }, {skip: !isPriceFiltered })

    // const { data: products, isLoading, error } = useGetProductsQuery();
    const { data, isLoading: isLoadingProducts, error: productError } = isPriceFiltered ? priceQuery : listQuery;
    // carousel products
    const {
        data: carouselData,
        isLoading: isLoadingCarousel,
        error: carouselError,
    } = useGetTopProductsQuery();
    // console.log(data)
    // combined loading state
    //   const isLoading = isLoadingProducts || isLoadingCarousel;
    //   const style = {
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   };
    //   console.log("carouselData:", carouselData)
    return (
        <>
            {/* carousel stays full width above the two columns */}
            {!isLoadingCarousel && !carouselError && !keyword && (
                <ProductCarousel products={carouselData || []} />)
            }

            <Row>
                {/* left:filter */}
                <Col md={4} lg={3} xl={2} className="mt-3">
                    <ProductFilter
                        key={`${minPrice}-${maxPrice}`}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onApply={applyFilter}
                        onReset={resetFilter}
                    />
                </Col>
                {/* Right:Prodcuts  */}
                <Col md={8} lg={9} xl={10} className="mt-3">
                    <h1>Latest Products</h1>
                    {
                        isLoadingProducts ?
                            (<Loader />) :
                            productError ? (
                                <Message>{productError?.data?.message || productError?.error}</Message>
                            ) : (
                                <>
                                    <Productlist products={data.products} />
                                    <Paginate
                                        pages={data.pages}
                                        page={data.page}
                                        keyword={keyword ? keyword : ""}
                                    />
                                </>
                            )
                    }
                </Col>
            </Row>
        </>
    );
};


export default Home;