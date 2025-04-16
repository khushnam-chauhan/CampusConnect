const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {protect}= require("../middleware/authMiddleware")
const { check } = require("express-validator");

const router = express.Router();

router.post(
    "/register",
    [
        check("fullName", "Full name is required").not().isEmpty(),
        check("rollNo", "Roll No is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    registerUser
);

router.post("/login", loginUser);
router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    role: req.user.role,
    email: req.user.email, // Optional
  });
});

module.exports = router;
