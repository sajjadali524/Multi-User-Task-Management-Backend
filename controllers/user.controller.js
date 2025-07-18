import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// register user
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {

        // check if user already exist
        const alreadyExist = await User.findOne({email});
        if(alreadyExist) {
            return res.status(400).json({message: "User already exist with this email"})
        };

        // create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashPassword});
        return res.status(200).json({message: "Account created successfully", user});

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
};

// login user or admdin
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({email});
        if(!user) {
            returnres.status(400).json({message: "Account not exist"})
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            returnres.status(400).json({message: "email or password in incorrect"})
        };

        const token = jwt.sign({id: user._id, role: user.role}, process.env.TOKEN_SECRET, {expiresIn: "1h"});
        returnres.status(200).cookie("token", token, {expiresIn: "1h", httpOnly: true}).json({message: `Welcome Back ${user.name}`, token, user});

    } catch (error) {
        returnres.status(500).json({message: "Internal server error"})
    }

};

// logout user
export const logoutUser = async (req, res) => {
    try {
        await res.status(200).cookie("token", "", {httpOnly: true, maxAge: 0}).json({message: "Account Logout Successfully"});
    } catch (error) {
    return res.status(500).json({message: "Internal server error"})  
    }
};