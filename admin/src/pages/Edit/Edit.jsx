import React, { useState, useEffect } from 'react'
import './Edit.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({url}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    ingredients: "",
    isVeg: true,
    rating: 5,
    preparationTime: 30,
    spiceLevel: "Medium"
  })

  useEffect(() => {
    const fetchFoodData = async () => {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const item = response.data.data.find(food => food._id === id);
        if (item) {
          setData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            ingredients: item.ingredients || "",
            isVeg: item.isVeg !== false,
            rating: item.rating || 5,
            preparationTime: item.preparationTime || 30,
            spiceLevel: item.spiceLevel || "Medium"
          });
          setExistingImage(item.image);
        } else {
          toast.error("Food item not found");
          navigate('/list');
        }
      }
    };
    fetchFoodData();
  }, [id, url, navigate]);


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", id)
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("price", Number(data.price))
    formData.append("ingredients", data.ingredients)
    formData.append("isVeg", data.isVeg)
    formData.append("rating", Number(data.rating))
    formData.append("preparationTime", Number(data.preparationTime))
    formData.append("spiceLevel", data.spiceLevel)
    if (image) {
        formData.append("image", image)
    }
    
    const response = await axios.post(`${url}/api/food/edit`, formData);
    if (response.data.success) {
      toast.success(response.data.message)
      navigate('/list');
    }
    else {
      toast.error(response.data.message)
    }
  }

  return (
    <div className='add'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Edit Food Item</h2>
            <button onClick={() => navigate('/list')} style={{ padding: '8px 15px', cursor: 'pointer' }}>Back to List</button>
        </div>
      <form className='flex-col' onSubmit={onSubmitHandler}>

        <div className="add-image-upload flex-col">
          <p>Upload New Image (Optional)</p>
          <label htmlFor='image'>
            <img src={image ? URL.createObjectURL(image) : (existingImage ? `${url}/images/${existingImage}` : assets.upload_area)} alt='' style={{ width: '120px', borderRadius: '10px' }} />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Type here' required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>

        <div className="add-category-price">

          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} value={data.category} name='category'>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desert">Desert</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type='number' name='price' placeholder='₹20' required />
          </div>

        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Veg / Non-Veg</p>
            <select onChange={onChangeHandler} value={data.isVeg} name='isVeg'>
              <option value={true}>Veg</option>
              <option value={false}>Non-Veg</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Spice Level</p>
            <select onChange={onChangeHandler} value={data.spiceLevel} name='spiceLevel'>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>
        </div>

        <div className="add-category-price">
          <div className="add-price flex-col">
            <p>Rating</p>
            <input onChange={onChangeHandler} value={data.rating} type='number' name='rating' placeholder='5' min="1" max="5" />
          </div>

          <div className="add-price flex-col">
            <p>Prep Time (mins)</p>
            <input onChange={onChangeHandler} value={data.preparationTime} type='number' name='preparationTime' placeholder='30' />
          </div>
        </div>

        <div className="add-product-description flex-col">
          <p>Ingredients</p>
          <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" placeholder='E.g., Tomato, Cheese, Basil'></textarea>
        </div>
        <button type='submit' className='add-but' >UPDATE</button>
      </form>
    </div>
  )
}

export default Edit
