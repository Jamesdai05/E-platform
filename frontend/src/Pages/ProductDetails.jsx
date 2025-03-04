import { Col, Image, ListGroup, Row,Button,Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating.jsx';
import products from '../products.js';




const ProductDetails = () => {

  const {id:productId}=useParams()

  const product=products.filter(item=>item._id===productId)
  console.log(product[0])

  return (
    <>
      <Link className="btn btn-secondary my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product[0].image} alt={product[0].name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product[0].name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product[0].rating}
                text={`${product[0].numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product[0].price}</ListGroup.Item>
            <ListGroup.Item>Description: {product[0].description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <b>${product[0].price}</b>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {product[0].countInStock > 0 ? "In Stock" : "Out Of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product[0].countInStock === 0}

                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default ProductDetails