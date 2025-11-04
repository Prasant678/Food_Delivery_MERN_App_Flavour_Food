import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order Your Favourite food here</h2>
        <p>Discover a diverse menu filled with mouth-watering dishes, crafted from the freshest ingredients and authentic flavors. Every bite is made to satisfy your cravings and make your dining experience unforgettable.</p>
        <button
          onClick={() =>
            document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Order Now
        </button>
      </div>
    </div>
  )
}

export default Header
