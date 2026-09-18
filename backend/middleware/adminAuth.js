import jwt from 'jsonwebtoken'
const adminAuth=async(req, res,next)=>{
    try{
        const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "")
        if(!token){
            return res.status(401).json({success:false, message:"Not authorised, login again"})
        }
        const token_decode=jwt.verify(token, process.env.JWT_SECRET);
        if(token_decode?.role !== "admin"){
           return res.status(403).json({success:false, message:"Admin access required"})
        }
        next()
    }catch(error){
        res.status(401).json({success:false, message:"Admin session expired. Please login again."})
    }
}
export default adminAuth
