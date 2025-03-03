import { Container, Nav, Navbar } from "react-bootstrap";
import logo from "../logo-eshop.jpg" ;
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
import { FaShoppingCart, FaUser } from "react-icons/fa";


const Header = () => {

  const fsStyle = { color: "#fff" };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="logo" style={{height:"50px",}}/>
          E-shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav> */}
          <Nav className="ms-auto">
            <Nav.Link href="/cart" style={fsStyle}>
              Cart <FaShoppingCart className="ms-0.5" />
            </Nav.Link>
            <Nav.Link href="/login" style={fsStyle}>
              User <FaUser className="ms-0.5" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
