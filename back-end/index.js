const express = require("express");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const cors = require("cors");
const Session = require("express-session");
const app = express();
app.use(express.json()); // JSON body parse ke liye

app.use(Session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}))

// ✅ CORS ENABLE
app.use(
  cors({
    origin: "http://localhost:3001", // frontend URL
    credentials: true,
  })
);


// Connect to DB
connectDB();

// Routes
const authRoutes = require("./routes/route");
const session = require("express-session");
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Server running  hello🚀");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});
