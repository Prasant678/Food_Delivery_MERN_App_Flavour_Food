import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Screens/Home/Home'
import Cart from './Screens/Cart/Cart'
import PlaceOrder from './Screens/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
// import Verify from './Screens/Verify/Verify'
import OrderSuccess from './Screens/OrderSuccess/OrderSuccess'
import OrderFailed from './Screens/OrderFailed/OrderFailed'

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
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
