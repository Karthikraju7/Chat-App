import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res)=>{
    const {fullName, email, password} = req.body;
    try{
        if (!fullName || !email || !password){
            return res.json({success: false, message: "Fill the Details"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({success: false, message: "Account exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName,email,password:hashedPassword   //creating user with hashed password
        })
        const token = generateToken(newUser._id)  //before this create utils.js file for JWT token
        res.json({success: true,userData: newUser , token , message: "Account created successfully"})
    } catch(error){
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}

export const login = async (req,res)=>{
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect){
            return res.json({success: false, message: "Invalid Credentials"});
        }
        const token = generateToken(userData._id)
        res.json({success: true,userData, token , message: "Login Successful"})    
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}

//Api endpoint ==> To check if user is authenticated    

export const checkAuth = (req,res)=>{    //before this creare auth.js in middleware
    res.json({success:true , user : req.user});
}

//Havent used this one yet in my app

// export const updateName = async(req,res) => {
//     try {
//         const {fullName} = req.body;
//         const userId = req.user._id
//         let updatedUser;
//         updatedUser = await User.findByIdAndUpdate(userId, {fullName} , {new : true})
//         res.json({success:true , user:updatedUser})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false,message: error.message})
//     }
// }


