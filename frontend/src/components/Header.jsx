import { Container, Nav, Navbar, Badge, NavDropdown} from "react-bootstrap";
import logo from "../logo-eshop.jpg" ;
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfilePage from "../Pages/ProfilePage.jsx";


const Header = () => {

  const { cartItems } = useSelector((state) => state.cart);

  const {userInfo} = useSelector(state=>state.auth)

  const fsStyle = { color: "#fff" };


  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="logo" style={{ height: "50px" }} />
          E-shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" style={fsStyle}>
              Cart <FaShoppingCart className="ms-0.5" />
              {cartItems.length > 0 && (
                <Badge pill bg="info" style={{ marginLeft: 5 }}>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </Badge>
              )}
            </Nav.Link>
            {userInfo ?
            (
              <NavDropdown title={userInfo.name} id="username">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} >Log Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" style={fsStyle}>
                User <FaUser className="ms-0.5" />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
