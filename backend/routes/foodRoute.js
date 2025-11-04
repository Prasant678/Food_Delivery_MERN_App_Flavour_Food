import express from 'express'
import { addFood, listFood, removeFood, updateFood } from '../controller/foodController.js'

const foodRouter = express.Router();

foodRouter.post("/add", addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)
foodRouter.put("/update/:id", updateFood);

export default foodRouter;