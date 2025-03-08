import { Col, Row, Button, Table } from "react-bootstrap";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import {
  useCreateProductMutation,
  useGetProductsQuery,
} from "../../slices/productsSlice.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Productls = () => {
  const { data: products, refetch, isLoading, error } = useGetProductsQuery();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const handleDelete = (id) => {
    console.log("delete", id);
  };

  const handleCreate = async () => {
    if (window.confirm("Are you sure you want to create a product?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Template Product is created.");
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>Products</Col>
        <Col className="text-end">
          <Button type="button" className="btn-sm m-3" onClick={handleCreate}>
            Create Product <FaEdit />
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
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
                  <Link to={`/admin/product/${p._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm mx-2"
                    onClick={() => handleDelete(p._id)}
                  >
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
};
export default Productls;
