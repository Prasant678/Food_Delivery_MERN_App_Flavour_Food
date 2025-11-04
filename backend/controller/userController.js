import  jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/userModel.js'

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: "User Dosesn't exists"})
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.json({success: false, message: "invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success: true, token})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: "User Already Exists"})
        }
        if (!validator.isEmail(email)) {
            return res.json({success:false, message: "please provide a valid email"})
        }
        if (password.length<8) {
            return res.json({success:false, message: "please enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({success: true, token})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select("-password");
        res.json({ success: true, user});
    } catch (error) {
        res.json({ success: false, message: "Error"});
    }
}

export { loginUser, registerUser, getUserProfile }