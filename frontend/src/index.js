import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import CartPage from './Pages/CartPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import ProductDetails from './Pages/ProductDetails.jsx';


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />}/>
      <Route path='/product/:id' element={<ProductDetails />}/>
      <Route path='/cart' element={<CartPage />}/>
      <Route path='/login' element={<LoginPage />}/>

    </Route>
  )
)




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

