import mongoose from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://dbhargav03008_db_user:%40Bhargav123@cluster0.vwvvuul.mongodb.net/tastecart').then(()=>console.log("DB Connected"))
}