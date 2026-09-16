import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/mongodb.js";
import productModel from "../models/productModel.js";
import curatedProducts from "../data/curatedProducts.js";

try {
  await connectDB();

  for (const product of curatedProducts) {
    await productModel.updateOne(
      { name: product.name },
      { $set: product },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${curatedProducts.length} Drip products.`);
} catch (error) {
  console.error("Product seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

