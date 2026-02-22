import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order form frontend
const placeOrder= async(req,resp)=>{

        const frontend_url = "http://localhost:5173";

    try {
        const neworder= new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await neworder.save();

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name,
                },
                unit_amount: Math.round(item.price * 91.59 * 100)
            },
            quantity:item.quantity,
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount: Math.round(2 * 91.59 * 100)
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${neworder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${neworder._id}`,
        })

        resp.json({success:true,message:"Order Placed Successfully",session_url:session.url});

    } catch (error) {
        console.log(error);
        resp.json({success:false,message:"Error in placing order"})
    }
}
// const verifyOrder= async(req,resp)=>{
//     const {orderId,success}= req.body;
//     try {
//         if (success=="true" || success === true){
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             resp.json({success:true,message:"Payment Successful and order verified"});
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId);
//             resp.json({success:false,message:"Payment Failed"});
//         }
//     } catch (error) {
//         console.log(error);
//         resp.json({success:false,message:"Error in verifying order"})
//     }
// }
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === true || success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Food Prrocessing"
      });

      // Clear the authenticated user's cart only after payment success
      await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

      return res.json({
        success: true,
        message: "Payment successful and order verified"
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);

      return res.json({
        success: false,
        message: "Payment cancelled"
      });
    }

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Error verifying order"
    });
  }
};

// users order for frontend
const userOrders= async(req,resp)=>{
  try {
    const orders=await orderModel.find({userId:req.userId});
    resp.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error in fetching user orders"})
  }
}

//Listing orders for admin panel
const listOrders= async(req,resp)=>{
  try {
    const orders= await orderModel.find({});
    resp.json({success:true,data:orders});
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error in listing orders"})
  }
}

//Api for updating order status
const updateStatus = async(req,resp)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    resp.json({success:true,message:"Order status updated successfully"});
  } catch (error) {
    console.log(error);
    resp.json({success:false,message:"Error in updating order status"})
  }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};