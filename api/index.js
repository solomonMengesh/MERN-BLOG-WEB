const express = require("express");
const app = express(); // Use '=' instead of 'express()'
const dotenv = require("dotenv");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/catagorys");
const multer = require("multer");
const path = require("path");

const cors = require('cors');
app.use(cors());  // Allow all origins by default


dotenv.config();
app.use(express.json());
app.use("/images" , express.static(path.join(__dirname,"images")))

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));



// app.use("/", (req, res) => {
//     console.log("hey me");
//     res.send("Hello from the server!"); // Send a response to the client
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");  // Set the folder where you want to store files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Use the original file name without a timestamp
    }
});

const upload = multer({ storage: storage });

// Create the POST endpoint for uploading files
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        res.status(200).json({ message: "File uploaded successfully", file: req.file });
    } catch (err) {
        res.status(500).json({ message: "File upload failed", error: err });
    }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); // Changed to /api/users instead of /api/auth
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute); // Category routes


app.listen(5000, () => {
    console.log("Backend is running");
});
