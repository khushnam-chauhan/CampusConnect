const User=require("../models/User");
const jwt= require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const {validationResult}= require("express-validator");

// genrate jwt token
const generateToken=(user)=>{
    return jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET,{expiresIn:"7d"});

};
// register user

exports.registerUser= async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});

    const {fullName,rollNo,email,password,role}= req.body;

    try{
        let user= await User.findOne({email});
        if(user) return res.status(400).json({message:"user already exists"});

        user= new User({fullName,rollNo,email, password,role});
        await user.save();
        res.status(201).json({message:"user registered successfully",token:generateToken(user)});

    }catch(error){
        res.status(500).json({message:"server error"});

    }
};

//login user
exports.loginUser= async (req,res)=>{
    const {email,password}= req.body;

    try{
        const user= await User.findOne({email});
        if(!user) return res.status(400).json({message:"invalid credentials"});

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"invalid credentials"});

        res.json({message:"login successful", token:generateToken(user)});
    }catch(error){
        res.status(500).json({message:"server error"});
    }
};