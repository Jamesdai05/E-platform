import './App.css';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { Container } from 'react-bootstrap';
import Productslist from './components/Productlist.jsx';
import products from './products.js';

function App() {
  return (
    <div className="App">
      <Header />
      <Container>
        <main className='pt-3 content'>
          <Productslist products={products} />
        </main>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
