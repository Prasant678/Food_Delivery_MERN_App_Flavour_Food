import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../Context/storeContext';
import axios from 'axios'

const Login = ({setShowSignin}) => {
    const {url, setToken} = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    })

    const onChangeHandler = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setData(data=>({...data,[name]:value}))
    }

    const Login = async (e) => {
      e.preventDefault();
      let newUrl = url;
      if (currState === "Login") {
        newUrl += "/api/v1/user/login"
      }
      else {
        newUrl += "/api/v1/user/register"
      }

      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowSignin(false);
      }
      else{
        alert(response.data.message);
      }
    }
  return (
    <div className='login'>
      <form onSubmit={Login} className="login-container">
        <div className="login-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowSignin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-inputs">
            {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' required/> }
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email-Id' required/>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required/>
        </div>
        <button type='submit'>{currState === "Login" ? "Login" : "Create Account"}</button>
        <div className="login-condition">
            <input type="checkbox" required/>
            <p>By Continuing, I agree to the terms of use and privacy policy.</p>
        </div>
        {currState === "Login" ? 
        <p>Create a new Account? <span onClick={()=>setCurrState("Sign Up")}>Sign Up</span></p>
        :<p>Already have an Account? <span onClick={()=>setCurrState("Login")}>Login</span></p>}
      </form>
    </div>
  )
}

export default Login
