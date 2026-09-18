import express from 'express';
import cors from 'cors';
import 'dotenv/config' 
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import wishlistRoute from './routes/wishlistRoute.js'
import maxDiscountRouter from './routes/maxDiscountRoute.js';
//app config
const app=express()
const port=process.env.PORT || 4000
//middleware
app.use(express.json())
app.use(cors())
//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use("/api/wishlist", wishlistRoute)
app.use('/api/maxDiscount', maxDiscountRouter);
app.get('/', (req,res)=>{
    res.send("Drip API working")
})
app.get('/api/health', (req, res) => {
    const database = connectDB.isConnected() ? "connected" : "disconnected"
    res.status(database === "connected" ? 200 : 503).json({
        success: database === "connected",
        service: "drip-api",
        database
    })
})

app.use((req, res) => {
    res.status(404).json({ success: false, message: "API route not found" })
})

app.use((error, req, res, next) => {
    console.error("Unhandled API error:", error)
    res.status(error.status || 500).json({
        success: false,
        message: error.status ? error.message : "Internal server error"
    })
})

export const initializeServices = async () => {
    await connectDB()
    await connectCloudinary()
}

const startServer = async () => {
    try {
        await initializeServices()
        app.listen(port, () => console.log("Drip API started on PORT :" + port))
    } catch (error) {
        console.error("Unable to start Drip API:", error.message)
        process.exit(1)
    }
}

if (!process.env.VERCEL) {
    startServer()
}

export default app
