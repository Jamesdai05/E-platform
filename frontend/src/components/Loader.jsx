import { Spinner } from "react-bootstrap";

const Loader = () => {
  const style = {
    width: "150px",
    height: "150px",
    margin: "auto",
    display: "block",
    marginTop:"20em",
    // justifyContent:"center",
    // alignItems:"center"
  };

  return (
    <div className="d-flex justify-content-center align-items-start">
      <Spinner animation="border" role="status" style={style} />
    </div>
  );
};
export default Loader;
