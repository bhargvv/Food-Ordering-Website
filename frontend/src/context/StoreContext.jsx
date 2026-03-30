import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "https://food-ordering-website-1-7j9n.onrender.com"
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item]
            }

        }
        return totalAmount;
    }
    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list")
        if (response.data.success) {
            setFoodList(response.data.data || [])
        } else {
            setFoodList([])
            console.error("Failed to fetch food list:", response.data.message)
        }
    }

    const loadCartData = async (userToken) => {
        const response = await axios.get(url + "/api/cart/get", { headers: { token: userToken } })
        setCartItems(response.data.cartData || {});
    }

    useEffect(() => {

        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, [])
    const [showLogin, setShowLogin] = useState(false);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        setShowLogin, showLogin,
        searchQuery, setSearchQuery
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}
export default StoreContextProvider; 