import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './FoodDetails.css';

const FoodDetails = () => {
    const { food_list, cartItems, addToCart, removeFromCart, url, selectedFoodId, setSelectedFoodId } = useContext(StoreContext);

    const food = food_list.find(item => item._id === selectedFoodId);

    if (!food) {
        return <div className="food-details-popup"><div className="food-details-not-found">Food item not found! <br/><button onClick={() => setSelectedFoodId(null)}>Close</button></div></div>;
    }

    return (
        <div className="food-details-popup">
            <div className="food-details-container">
                <button className="close-btn" onClick={() => setSelectedFoodId(null)}>×</button>
                <div className="food-details-content">
                    <div className="food-details-left">
                        <img src={url + "/images/" + food.image} alt={food.name} className="food-details-image" />
                    </div>
                <div className="food-details-right">
                    <div className="food-title-section">
                        <h2>{food.name}</h2>
                        <p className="food-veg-indicator" style={{ color: food.isVeg !== false ? 'green' : 'red' }}>
                            {food.isVeg !== false ? '🟢 Veg' : '🔴 Non-Veg'}
                        </p>
                    </div>
                    <div className="food-meta">
                        <span className="rating">⭐ {food.rating || 5} / 5</span>
                        <span className="prep-time">⏱️ {food.preparationTime || 30} mins</span>
                        <span className="spice-level">🌶️ {food.spiceLevel || 'Medium'}</span>
                    </div>
                    
                    <h3 className="food-price">₹{food.price}</h3>
                    
                    <p className="food-description">{food.description}</p>
                    
                    <div className="food-ingredients">
                        <h4>Ingredients</h4>
                        <p>{food.ingredients || 'Not specified'}</p>
                    </div>

                    <div className="food-details-actions">
                        {!cartItems[food._id] ? (
                            <button className="add-to-cart-btn" onClick={() => addToCart(food._id)}>Add to Cart</button>
                        ) : (
                            <div className='food-details-counter'>
                                <img onClick={() => removeFromCart(food._id)} src={assets.remove_icon_red} alt='' />
                                <p id='count'>{cartItems[food._id]}</p>
                                <img onClick={() => addToCart(food._id)} src={assets.add_icon_green} alt='' />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default FoodDetails;
