import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import {genToken} from "../config/token.js";

export const signUp=async (req,res)=>{

    try {
        const {firstName,lastName,userName,email,password}=req.body;
        let existUser=await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"user already exist"})
        }
        let existUserName=await User.findOne({userName})
        if(existUserName){
            return res.status(400).json({message:"username already exist"})
        }

        if(password.length<8){
            return res.status(500).json({message:"password must be eight characters"})
        }
        let hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword
        })

        const token=await genToken(newUser._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:30*24*60*60*1000,
            secure:process.env.NODE_ENVIRONMENT==="production",
            sameSite:"strict"
        })
        

        res.status(201).json({success:true,newUser})

    } catch (error) {
        console.log("signup error",error.message);
        res.status(500).json({message:error.message})
    }
}

export const login=async (req,res)=>{

    try {
        const {email,password}=req.body;
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not found"})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }

        const token=await genToken(user._id)
        console.log("token",token);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:30*24*60*60*1000,
            secure:process.env.NODE_ENVIRONMENT==="production",
            sameSite:"strict"
        })
        

        res.status(201).json({message:"successfuly logged in",user})

    } catch (error) {
        console.log("login error",error.message);
        res.status(500).json({message:error.message})
    }
}

export const logout=async (req,res)=>{
    try {
        res.clearCookie("token")
        console.log("token is cleared")
        res.status(200).json({message:"successfuly logged out"})
    } catch (error) {
        console.log("logout error",error.message);
        res.status(500).json({message:error.message})
    }
}