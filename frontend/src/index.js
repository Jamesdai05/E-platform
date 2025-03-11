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
import PrivateRoute from './components/PrivateRoute.jsx';
import OrderPage from './Pages/OrderPage.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AdminRoute from './components/AdminRoute.jsx';
import Orderlist from './Pages/Admin/Orderlist.jsx';
import Userlist from './Pages/Admin/Userlist.jsx';
import Productls from './Pages/Admin/Productls.jsx';
import ProductEdit from './Pages/Admin/ProductEdit.jsx';
import UserEdit from './Pages/Admin/UserEdit.jsx';





const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />}/>
      <Route path='/search/:keyword' element={<Home />}/>
      <Route path='/page/:pageNumber' element={<Home />}/>
      <Route path='/search/:keyword/page/:pageNumber' element={<Home />}/>
      <Route path='/product/:id' element={<ProductDetails />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<Registration />}/>

      <Route path="" element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/shipping' element={<ShippingPage />}/>
        <Route path='/payment' element={<Payment />}/>
        <Route path='/placeorder' element={<Placeorder />}/>
        <Route path='/cart' element={<CartPage />}/>
        <Route path='/order/:id' element={<OrderPage />}/>
      </Route>

      <Route path="/" element={<AdminRoute/>}>
        <Route path="/admin/orderlist" element={<Orderlist />} />
        <Route path="/admin/productlist" element={<Productls />} />
        <Route path="/admin/userlist" element={<Userlist />} />
        <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
        <Route path="/admin/user/:id/edit" element={<UserEdit />} />
      </Route>
    </Route>
  )
)





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider >
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

