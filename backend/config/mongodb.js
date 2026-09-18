import mongoose from "mongoose";
const connectDB=async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("DB connected");
    })
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB || "drip_store",
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000
    });
}
connectDB.isConnected = () => mongoose.connection.readyState === 1;
export default connectDB;
