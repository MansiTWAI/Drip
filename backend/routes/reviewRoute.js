import express from "express";
import authUser from "../middleware/auth.js";
import { myReviews, productReviews, saveReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.get("/product/:productId", productReviews);
reviewRouter.get("/mine", authUser, myReviews);
reviewRouter.post("/save", authUser, saveReview);

export default reviewRouter;
