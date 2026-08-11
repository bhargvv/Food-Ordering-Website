import React from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, price, description, image }) => {

    const {cartItems, setCartItems, addToCart, removeFromCart,url, setSelectedFoodId} =useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt='' onClick={() => setSelectedFoodId(id)} style={{ cursor: 'pointer' }} />

        {
          !cartItems[id] ?
          <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
          : <div className='food-item-counter'>
            <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt='' />
            <p>{cartItems[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt='' />
          </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p onClick={() => setSelectedFoodId(id)} style={{ cursor: 'pointer' }}>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
      </div>
      <p className="food-item-desc">{description}</p>
      <p className="food-item-price">₹{price}</p>
    </div>
  )
}

export default FoodItem
