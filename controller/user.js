import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const signup=async(req,res)=>{
    try {
      const {name,email,password,role}=req.body;
     
      const hashedPassword = await bcrypt.hash(password, 10)
      const user=new User({name,email,password:hashedPassword,role});
      const newUser=await user.save();

      const token= jwt.sign({userId:newUser._id},process.env.SECERT_KEY || "111223",{
        expiresIn: "2d"
      } )

      res.cookie("token", token, {
        // httpOnly: true,      
        // sameSite: "None",    
        // secure: true,        
        // maxAge: 2 * 24 * 60 * 60 * 1000, 
        httpOnly: false,
        sameSite:"Lax", 
        secure: true,                   
        maxAge: 2* 24 * 60 * 60 * 1000,  
      });

      res.status(201).json({message: 'User registered successfully', data: newUser})
    } catch (error) {
      res.status(400).json({message: error.message, error})
    }
}

export const login=async(req,res)=>{
    try {
      const {email,password}=req.body;
      const user=await User.findOne({email});
      if(!user) return res.status(404).json({message: 'User not found'})
      const isMatch=await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({message: 'Invalid credentials'})
        
      const token= jwt.sign({userId:user._id},process.env.SECERT_KEY || "111223",{
        expiresIn: "2d"
      } )

      console.log("token: " + token)
      res.cookie("token", token, {
        httpOnly: false,        
        sameSite: "Lax",       
        secure: true,          
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
    //   const token=user.generateToken();
      res.json({message: 'User logged in successfully',data:user})
    } catch (error) {
      res.status(500).json({message: error.message, error})
    }
}