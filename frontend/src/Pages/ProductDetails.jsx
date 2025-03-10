import { Col, Image, ListGroup, Row,Button,Card,Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating.jsx';
import { useCreateReviewMutation, useGetProductDetailsQuery } from '../slices/productsSlice.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '../slices/cartSlice.js';
import { toast } from 'react-toastify';



const ProductDetails = () => {
  // const [product, setProduct] = useState({});
  // set the default qty to 1
  const [qty,setQty]=useState(1)

  const { id: productId } = useParams();
  // const url=`/api/products/${productId}`
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [rating,setRating]=useState(0);
  const [comment,setComment]=useState("");



  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, {isLoading:loadingReview}] =useCreateReviewMutation();

  const userInfo=useSelector(state=>state.auth);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    // navigate to cart page
    navigate("/cart");
  };

  const handleReviewSubmit=async(e)=>{
    e.preventDefault();
    // console.log("submitted")
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      //Prompt that it is done
      toast.success("Review submitted!");
      // reset the form
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error.error)
      toast.error(error?.data?.message || error?.error)
    }
  }

  return (
    <>
      <Link className="btn btn-secondary my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error?.data?.message || error?.error}</Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <b>${product.price}</b>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          {/* to address the available option for select */}
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (e) => (
                                <option key={e + 1} value={e + 1}>
                                  {e + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review my-4">
            <Col md={6}>
              <h3>Reviews</h3>
              {product.reviews.length === 0 && (
                <Message>No review yet.</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <b>{review.name}</b>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a Customer Review</h4>

                  {loadingReview && <Loader />}
                  {!userInfo ? (
                    <Message>
                      Please <Link to="/login">log in</Link> to write a review.
                    </Message>
                  ) : (
                    <Form>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Please make a review</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - VeryGood</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleReviewSubmit}
                        disabled={loadingReview}
                        className="my-3"
                      >
                        Submit
                      </Button>
                    </Form>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
export default ProductDetails