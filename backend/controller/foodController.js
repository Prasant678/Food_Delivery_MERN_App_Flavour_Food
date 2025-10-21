import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";


const addFood = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next("Project Banner Image Required!", 404);
          }
        const image_file = req.files.image;
        const cloudinaryResponse = await cloudinary.uploader.upload(
            image_file.tempFilePath,
            { folder: "FOOD IMAGES" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponse.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload food to Cloudinary", 500));
        }
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: {
                public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
                url: cloudinaryResponse.secure_url
            }
        })
        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        const foodImageId = food.image.public_id;
        await cloudinary.uploader.destroy(foodImageId);
        await food.deleteOne();
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

export { addFood, listFood, removeFood }