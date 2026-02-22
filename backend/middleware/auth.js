import jwt from 'jsonwebtoken';

const authMiddleware = async (req, resp, next) => {
    const {token} = req.headers;
    if(!token){
        return resp.json({success:false,message:"Not authorized Login again"})
    }
    try {
        const token_decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = token_decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return resp.json({success:false,message:"Error"})
    }
}

export default authMiddleware;