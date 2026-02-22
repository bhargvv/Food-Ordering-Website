import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken, searchQuery, setSearchQuery } = useContext(StoreContext)
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  }
  const myOrders = () => {
    navigate("/myorders");
  }

  return (
    <div className='navbar'>
      <div className='navbar-inner'>
        <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
        <ul className="navbar-menu">
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
          <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact-us</a>
        </ul>
        <div className="navbar-right">
          <div className="navbar-search">
            {showSearch && (
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
            )}
            <img src={assets.search_icon} alt="search" onClick={() => setShowSearch(!showSearch)} className="search-icon" />
          </div>
          <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
          {!token ?
            <button onClick={() => setShowLogin(true)} >sign in</button>
            :
            <div className='navbar-profile'>
              <img src={assets.profile_icon} alt='' />
              <ul className="navbar-profile-dropdown">
                <li onClick={myOrders}><img src={assets.bag_icon} /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} /><p>Logout</p></li>
              </ul>
            </div>}

        </div>
      </div>
    </div>
  )
}

export default Navbar
