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
import { Provider } from 'react-redux';
import store from './store.js';
import Registration from './Pages/Registration.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import ShippingPage from './Pages/ShippingPage.jsx';
import Payment from './Pages/Payment.jsx';
import Placeorder from './Pages/Placeorder.jsx';
import PrivateRoute from './Pages/PrivateRoute.jsx';


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />}/>
      <Route path='/product/:id' element={<ProductDetails />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<Registration />}/>

      <Route path="" element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/shipping' element={<ShippingPage />}/>
        <Route path='/payment' element={<Payment />}/>
        <Route path='/placeorder' element={<Placeorder />}/>
        <Route path='/cart' element={<CartPage />}/>
      </Route>
    </Route>
  )
)




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

