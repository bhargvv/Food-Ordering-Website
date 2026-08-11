import foodModel from "../models/foodModel.js";
import fs from 'fs';

//add food item

const addFood = async (req, resp) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        ingredients: req.body.ingredients || "Not specified",
        isVeg: req.body.isVeg === 'false' ? false : true,
        rating: req.body.rating ? Number(req.body.rating) : 5,
        preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : 30,
        spiceLevel: req.body.spiceLevel || "Medium"
    })
    try{
        await food.save();
        resp.json({success:true,message:"Food Added"})
    }catch (error){
        console.log(error)
        resp.json({success:false,message:"Error"})
    }
}

//all food list
const listFood = async(req,resp)=>{
    try {
        const foods= await foodModel.find({});
        resp.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        resp.json({success:false,message:"Error"})
    }
}

//remove food item
const removeFood = async (req,resp)=>{
    try {
        const food=await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        resp.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.group(error)
        resp.json({success:false,message:"Error"})
    }
}

// edit food item
const editFood = async (req, resp) => {
    console.log("Edit request received for ID:", req.body.id);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    try {
        let updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price ? Number(req.body.price) : undefined,
            category: req.body.category,
            ingredients: req.body.ingredients,
            isVeg: req.body.isVeg === 'false' ? false : true,
            rating: req.body.rating ? Number(req.body.rating) : undefined,
            preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : undefined,
            spiceLevel: req.body.spiceLevel
        };

        // Remove undefined fields so they don't overwrite with undefined
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        if (req.file) {
            updateData.image = req.file.filename;
            let oldFood = await foodModel.findById(req.body.id);
            if(oldFood && oldFood.image) {
                fs.unlink(`uploads/${oldFood.image}`, () => {})
            }
        }

        const result = await foodModel.findByIdAndUpdate(req.body.id, updateData, { new: true });
        
        if (!result) {
            console.log("Food item not found for ID:", req.body.id);
            return resp.json({ success: false, message: "Food item not found" });
        }

        console.log("Successfully updated food item:", result);
        resp.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.error("Error updating food item:", error);
        resp.json({ success: false, message: "Error updating food item" });
    }
}

export { addFood, listFood, removeFood, editFood }