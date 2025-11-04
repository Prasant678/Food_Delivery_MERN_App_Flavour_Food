import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/storeContext';

const Navbar = ({ setShowSignin }) => {
  const [menu, setMenu] = useState("");
  const { getTotalAmount, token, setToken } = useContext(StoreContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const Logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowDropdown(false);
    navigate('/')
  };

  const handleDropdownClick = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScrollTo = (id, menuName) => {
    setMenu(menuName);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      
      <ul className="nav-menu">
        <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        <li onClick={() => handleScrollTo("explore-menu", "Menu")} className={menu === "Menu" ? "active" : ""}>Menu</li>
        <li onClick={() => handleScrollTo("app-download", "Mobile-app")} className={menu === "Mobile-app" ? "active" : ""}>Mobile app</li>
        <li onClick={() => handleScrollTo("footer", "contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</li>
      </ul>

      <div className="nav-right">
        <li onClick={() => handleScrollTo("food-display")}>
          <img src={assets.search_icon} alt="" />
        </li>
        <div className="nav-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button onClick={() => setShowSignin(true)}>Sign In</button>
        ) : (
          <div className='nav-profile' ref={dropdownRef}>
            <img
              src={assets.profile_icon}
              alt=""
              onClick={() => setShowDropdown(!showDropdown)}
              className='profile-icon'
              style={{ cursor: 'pointer'}}
            />
            {showDropdown && (
              <ul className="nav-profile-dropdown">
                <li onClick={() => handleDropdownClick('/profile')}>
                  <img className='profile' src={assets.profile_icon} alt="" />
                  <p className='profile-text'>Profile</p>
                </li>
                <hr />
                <li onClick={() => handleDropdownClick('/orders')}>
                  <img src={assets.bag_icon} alt="" />
                  <p className='order'>Orders</p>
                </li>
                <hr />
                <li onClick={Logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p className='logout'>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
