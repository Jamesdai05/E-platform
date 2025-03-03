import Productslist from "../components/Productlist.jsx";
import products from "../products";


const Home = () => {

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <h1>Latest Products</h1>
      <Productslist products={products} style={style} />
    </>
  );
};

export default Home;
