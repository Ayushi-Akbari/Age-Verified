// mongoose-connect.js
const mongoose = require("mongoose");
// require('dotenv').config();
// mongoose.connect(process.env.MONGO_URI);

const uri = "mongodb://localhost:27017/age-verification"; 

mongoose.connect(uri)
.then(() => {
  console.log("Connected to MongoDB via Mongoose!");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});

