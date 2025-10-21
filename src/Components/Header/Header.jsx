import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order Your Favourite food here</h2>
            <p>Choose from a diverse menu featuring a deletable array of dishes crafted with the finest ingredients and cilinary expertise. Our mission is to satisfy your cravings and elevate your dining experenice, one delicious meal at a time.</p>
            <button><a href="#explore-menu">View Menu</a></button>
        </div>
    </div>
  )
}

export default Header
