import { Col, Row,Button,Table } from "react-bootstrap";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import { useGetProductsQuery } from "../../slices/productsSlice.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";




const Productls = () => {

  const {data:products, isLoading,error}=useGetProductsQuery();

  const handleDelete=(id)=>{
    console.log("delete",id)
  }

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
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.countInStock}</td>
                <td>
                  <Link to={`/admin/product/${p._id}`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button variant="danger" className="btn-sm mx-2" onClick={()=>handleDelete(p._id)}>
                      <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
export default Productls