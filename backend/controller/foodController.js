import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";


const addFood = async (req, res, next) => {
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

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    const updatedFood = await foodModel.findByIdAndUpdate(
      id,
      { name, price, description, category },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.status(200).json({ success: true, message: "Food updated successfully", data: updatedFood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addFood, listFood, removeFood, updateFood }