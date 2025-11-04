import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Screens/Home/Home'
import Cart from './Screens/Cart/Cart'
import PlaceOrder from './Screens/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import OrderSuccess from './Screens/OrderSuccess/OrderSuccess'
import OrderFailed from './Screens/OrderFailed/OrderFailed'
import Profile from './Screens/profile/Profile'
import Orders from './Screens/Orders/Orders'
import OrderDetails from './Screens/OrderDetails/OrderDetails'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showSignin, setShowSignin] = useState(false);
  return (
    <>
      {showSignin ? <Login setShowSignin={setShowSignin} /> : <></>}
      <div className='app'>
        <Navbar setShowSignin={setShowSignin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-failed" element={<OrderFailed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position='bottom-right' theme='dark' />
    </>
  )
}

export default App
