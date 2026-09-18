import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
const createToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}
//route for user login
const loginUser=async(req, res)=>{
    try{
        const {email, password}=req.body;
        if (!validator.isEmail(String(email || "")) || !password) {
            return res.status(400).json({success:false, message:"Email and password are required"})
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(401).json({success:false, message:"Invalid credentials"})
        
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(isMatch){
            const token=createToken(user._id)
            res.json({success:true, token})
        }
        else{
            res.status(401).json({success:false, message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, message:"Unable to login"})
    }
}
//route for user registration
const registerUser=async(req,res)=>{
    try{
        const {name, email, password}=req.body;
        if (!String(name || "").trim() || !email || !password) {
            return res.status(400).json({success:false, message:"Name, email and password are required"})
        }
        //checking user already exists or not
        const exists=await userModel.findOne({email})
        if(exists){
            return res.status(409).json({success:false, message:"User already exists"})
        }
        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message:"Please enter a valid email"})
        }
        if(password.length<8){
            return res.status(400).json({success:false, message:"Password must contain at least 8 characters"})
        }
        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password, salt)
        const newUser=new userModel({
            name,
            email,
            password:hashedPassword
        })
        const user=await newUser.save()
        const token= createToken(user._id)
        res.json({success:true, token})
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, message:"Unable to create account"})
    }
}
//route for admin login
const adminLogin=async(req, res)=>{
    try{
        const {email, password}=req.body
        if(email === process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" })
            res.json({success:true, token})
        }
        else{
            res.status(401).json({success:false, message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({success:false, message:"Unable to login"})
    }
}
export {loginUser, registerUser, adminLogin}
