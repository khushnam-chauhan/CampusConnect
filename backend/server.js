require("dotenv").config();
const express= require("express");
const cors= require("cors");
const connectDb= require("./config/db");
const authRoutes= require("./routes/authRoutes");
const jobRoutes= require("./routes/jobRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const app= express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));



// connect db
connectDb();



//apis
app.get('/',(req,res)=>{
    res.send("api connected...");
});

//start server
const PORT= process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
