import './App.css';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { Container } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
      <Header />
      <Container>
        <main className='pt-3 content'>
          <h2>Welcome to the platform!</h2>
        </main>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
