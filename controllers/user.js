const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require('bcryptjs'); 

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "User logged in", token });
    } else {
      return res.status(400).json({ msg: "Invalid password" });
    }
  } else {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});

  return res.status(200).json({ users });
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

const forgotPassword = async (req, res) => {  
  console.log('-----------------------------------');
  console.log('Forgot Password Controller Hit');
  console.log('Full Request Body:', req.body);
  console.log('Request Headers:', req.headers);

  const { email, newPassword } = req.body;  

  // Input validation  
  if (!email || !newPassword) {  
    console.log('Validation Failed: Missing email or password');
    return res.status(400).json({ 
      msg: "Email and new password are required",
      receivedData: req.body
    });  
  }  

  try {  
    // Find user by email  
    console.log('Searching for user with email:', email);
    let foundUser = await User.findOne({ email });  

    if (!foundUser) {  
      console.log('User not found with email:', email);
      return res.status(404).json({ 
        msg: "User not found",
        searchEmail: email
      });  
    }  

    // Update password directly (will trigger pre-save middleware)
    foundUser.password = newPassword;  
    await foundUser.save();  

    console.log('Password successfully updated');
    return res.status(200).json({ 
      msg: "Password successfully updated",
      email: foundUser.email
    });  
  } catch (error) {  
    console.error('Full error in forgotPassword:', error);
    return res.status(500).json({   
      msg: "An error occurred while resetting password",   
      error: error.message,
      fullError: error
    });  
  }  
};  

module.exports = {  
  login,  
  register,  
  dashboard,  
  getAllUsers,  
  forgotPassword   
};  
