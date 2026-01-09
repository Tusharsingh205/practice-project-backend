const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { auth, isStudent,isAdmin } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);


// protect route

router.get("/auth-test", auth, (req, res) => {
  res.json({ success: true, message: "Welcome to the protected route for Test 🚀" });
});

router.get("/student", auth, isStudent, (req, res) => {
  res.json({ success: true, message: "Welcome to the protected route for Student 🚀" });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({ success: true, message: "Admin auth route working 🚀" });
});


module.exports = router;
