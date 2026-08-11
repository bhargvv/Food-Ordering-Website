import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import './App.css'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import Myorders from './pages/MyOrders/Myorders'
import FoodDetails from './pages/FoodDetails/FoodDetails'
import AIChatWidget from './components/AIChatWidget/AIChatWidget'
import { StoreContext } from './context/StoreContext'
import { useContext } from 'react'

const App = () => {

  // const [showLogin, setShowLogin] = useState(false);
    const { showLogin,setShowLogin, selectedFoodId } = useContext(StoreContext)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {selectedFoodId ? <FoodDetails /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          < Route path='/' element={<Home />} />
          < Route path='/cart' element={<Cart />} />
          < Route path='/order' element={<PlaceOrder />} />
          < Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<Myorders />} />
        </Routes>
      </div>
      <Footer />
      <AIChatWidget />
    </>
  )
}

export default App
