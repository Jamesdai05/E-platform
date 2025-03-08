import { Col, Row,Button,Table } from "react-bootstrap";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import { useGetProductsQuery } from "../../slices/productsSlice.js";
import { FaEdit } from "react-icons/fa";





const Productls = () => {

  const {data:products, isLoading,error}=useGetProductsQuery();



  return (
    <>
      <Row className="align-items-center">
        <Col>Products</Col>
        <Col className="text-end">
          <Button type="button" className="btn-sm m-3">
            Create Product <FaEdit />
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.message}
        </Message>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p._id}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td></td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
export default Productls