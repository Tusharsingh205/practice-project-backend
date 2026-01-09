const express = require("express");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const cors = require("cors");

const app = express();
// ✅ CORS ENABLE
app.use(
  cors({
    origin: "http://localhost:3001", // frontend URL
    credentials: true,
  })
);

app.use(express.json()); // JSON body parse ke liye

// Connect to DB
connectDB();

// Routes
const authRoutes = require("./routes/route");
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Server running  hello🚀");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});
