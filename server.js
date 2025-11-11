require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors')
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration flexible
app.use(cors({
  origin: [
    'http://localhost:5173',   // Default Vite dev server
    'http://127.0.0.1:5173',   // Localhost variant
    process.env.FRONTEND_URL || '*'  // Environment variable or wildcard
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes (nanti akan dibuat)
const userRoutes = require("./routes/user");
app.use("/api/v1", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  res.status(500).json({ 
    msg: 'Internal Server Error', 
    error: err.message,
    details: process.env.NODE_ENV !== 'production' ? err.stack : {}
  });
});

// Fallback route
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const port = process.env.PORT || 3000;

const start = async () => {
    try {        
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    } catch (error) {
       console.log(error); 
    }
}

start();