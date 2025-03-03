import './App.css';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { Container } from 'react-bootstrap';
// import Productslist from './components/Productlist.jsx';
// import products from './products.js';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
