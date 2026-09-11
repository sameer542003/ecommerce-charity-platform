const express = require("express")
require("dotenv").config()
const app = express()
const cors = require("cors")

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose")
const port = process.env.PORT || 8080
const url = process.env.URL

const userRoutes=require("./routes/user")
const categoryRoutes = require("./routes/category")
const charityRoutes = require("./routes/charity")
const productRouter = require("./routes/product");
const addressRouter = require("./routes/address");
const orderRoutes = require("./routes/order");


async function connectToMongoDB() {
    try {
        await mongoose.connect(url)
        console.log("connected to the database✅");
    } catch (err) {
        console.log("MongoDB connection error:", err);
    }
}

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/charity", charityRoutes);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/orders", orderRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to E-commerce charity")
})

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ status: "Failed", message: "Route not found" })
})

// Central error handler (catches anything passed to next(err))
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({ status: "Failed", message: err.message || "Server error" })
})

app.listen(port, () => {
    connectToMongoDB()
    console.log(`server is running at port ${port}`);
})
