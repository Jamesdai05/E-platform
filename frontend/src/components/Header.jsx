import { Container, Nav, Navbar, Badge, NavDropdown} from "react-bootstrap";
import logo from "../logo-eshop.jpg" ;
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice.js";
import { logout } from "../slices/authSlice.js";
import SearchBox from "./SearchBox.jsx";
import { resetCart } from "../slices/cartSlice.js";

const Header = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const {userInfo} = useSelector(state=>state.auth);

  const fsStyle = { color: "#fff" };

  const [logoutApiCall]=useLogoutMutation()

  const handleLogOut=async()=>{
    try{
      // promise unwrap;
      await logoutApiCall().unwrap();
      dispatch(logout());
      resetCart();
      navigate("/login");
    }catch(err){
      console.log(err);
    }
  }


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
            <SearchBox />
            <Nav.Link as={Link} to="/cart" style={fsStyle}>
              Cart <FaShoppingCart className="ms-0.5" />
              {cartItems.length > 0 && (
                <Badge pill bg="info" style={{ marginLeft: 5 }}>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </Badge>
              )}
            </Nav.Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="username">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} onClick={handleLogOut}>
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" style={fsStyle}>
                User <FaUser className="ms-0.5" />
              </Nav.Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="adminmenu">
                <NavDropdown.Item as={Link} to="/admin/productList">
                  Productlist
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orderList">
                  OrderList
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/userList">
                  UserList
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
