import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/storeContext';

const Navbar = ({setShowSignin}) => {

    const [menu, setMenu] = useState("");
    const { getTotalAmount, token, setToken } = useContext(StoreContext)
    
    const Logout = () => {
        localStorage.removeItem("token");
        setToken("")
    }
  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo1} alt="" className='logo'/></Link>
        <ul className="nav-menu">
            <Link to='/' onClick={()=>setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
            <a href="#explore-menu" onClick={()=>setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
            <a href="#app-download" onClick={()=>setMenu("Mobile-app")} className={menu === "Mobile-app" ? "active" : ""}>Mobile app</a>
            <a href="#footer" onClick={()=>setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
        </ul>
        <div className="nav-right">
            <img src={assets.search_icon} alt="" />
            <div className="nav-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalAmount() === 0 ? "" : "dot"}></div>
            </div>
            {!token?
            <button onClick={()=>setShowSignin(true)}>Sign In</button>:
            <div className='nav-profile'>
                <img src={assets.profile_icon} alt="" />
                <ul className="nav-profile-dropdown">
                <li><img className='profile' src={assets.profile_icon} alt="" /><p className='profile-text'>Profile</p></li>
                <hr />
                <li><img src={assets.bag_icon} alt="" /><p className='order'>Orders</p></li>
                <hr />
                <li onClick={Logout}><img src={assets.logout_icon} alt="" /><p className='logout'>Logout</p></li>
                </ul>
            </div>
            }
            
        </div>
    </div>
  )
}

export default Navbar
