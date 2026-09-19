import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const normalizeRating = (value) => Number(value);

export const productReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const reviews = await reviewModel.find({ productId })
      .select("userName rating description verifiedPurchase createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const count = reviews.length;
    const average = count
      ? Number((reviews.reduce((total, review) => total + review.rating, 0) / count).toFixed(1))
      : 0;
    const breakdown = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((review) => review.rating === rating).length,
    }));

    return res.json({ success: true, average, count, breakdown, reviews });
  } catch (error) {
    console.error("List reviews error:", error);
    return res.status(500).json({ success: false, message: "Unable to load reviews" });
  }
};

export const myReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ userId: req.user.id }).lean();
    return res.json({ success: true, reviews });
  } catch (error) {
    console.error("My reviews error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your reviews" });
  }
};

export const saveReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, orderId, rating, description } = req.body;
    const numericRating = normalizeRating(rating);
    const cleanDescription = String(description || "").trim();

    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order or product" });
    }
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Choose a rating from 1 to 5" });
    }
    if (cleanDescription.length < 10 || cleanDescription.length > 1000) {
      return res.status(400).json({ success: false, message: "Review must be between 10 and 1000 characters" });
    }

    const deliveredOrder = await orderModel.findOne({
      _id: orderId,
      userId,
      status: "Delivered",
      "items.productId": productId,
    });
    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: "Reviews are available after this product is delivered",
      });
    }

    const user = await userModel.findById(userId).select("name");
    const review = await reviewModel.findOneAndUpdate(
      { productId, userId },
      {
        productId,
        userId,
        orderId,
        userName: user?.name?.trim() || "Drip customer",
        rating: numericRating,
        description: cleanDescription,
        verifiedPurchase: true,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: "Review published", review });
  } catch (error) {
    console.error("Save review error:", error);
    return res.status(500).json({ success: false, message: "Unable to save review" });
  }
};
