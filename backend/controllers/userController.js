import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login user
const loginUser = async (req, resp) => {
    const {email,password}=req.body;
    try {
        const user = await userModel.findOne({email});

        if(!user){
            return resp.json({success:false,message:"User doesn't exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return resp.json({success:false,message:"invalid credentials"})
        }

        const token = createToken(user._id);
        resp.json({success:true,token})

    } catch (error) {
        console.log(error)
        resp.json({success:false,message:"Error"})
    }
}

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, resp)=>{
    console.log("REQ BODY:", req.body);

    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            //checking  if user already exists
            return resp.json({ success: false, message: "User already exists..." })
        }

        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return resp.json({ success: false, message: "Please enter a valid email" })
        }
        if(password.length<8){
            return resp.json({success:false,message:"Please enter a strong password"})
        }
        //hashing user pasword
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser= new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        resp.json({success:true,token})


    } catch (error) {
        console.log(error)
        resp.json({success:false,message:"Error"})
    }
}

export { loginUser, registerUser }