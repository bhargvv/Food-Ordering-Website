import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: { type: String, default: "Not specified" },
    isVeg: { type: Boolean, default: true },
    rating: { type: Number, default: 5 },
    preparationTime: { type: Number, default: 30 },
    spiceLevel: { type: String, default: "Medium" }
})
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;