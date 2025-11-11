const express = require("express");
const router = express.Router();

const { 
  login, 
  register, 
  dashboard, 
  getAllUsers, 
  forgotPassword 
} = require("../controllers/user");  // SESUAIKAN PATH
const authMiddleware = require('../middleware/auth')  // SESUAIKAN PATH

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);

// Tambahkan logging lebih detail
router.post("/forgot-password", (req, res, next) => {
  console.log('Forgot Password Route Hit');
  console.log('Full Request Details:', {
    body: req.body,
    headers: req.headers,
    path: req.path,
    method: req.method
  });
  next();
}, forgotPassword);

module.exports = router;
