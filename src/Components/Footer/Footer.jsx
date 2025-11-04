import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className='footer-content-left'>
            <img className='logo' src={assets.logo} alt="" />
            <p>Flavour Food brings you fresh, delicious meals made with care and quality ingredients. From quick bites to full meals, we’re here to make every craving count.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className='footer-content-center'>
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className='footer-content-right'>
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-9692858292</li>
                <li>contact@flavourfood.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright" style={{ color: "#d4d4d8", letterSpacing: "0.10em"}}>Copyright 2024 © flavourfood.com - All Right Reserved</p>
    </div>
  )
}

export default Footer
