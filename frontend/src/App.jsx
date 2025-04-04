import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
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
      <main className="py-3 content">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
