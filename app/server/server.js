const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const userRoutes = require("./Routes/userRoutes.js")



const app = express();
const PORT = 8001;

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

 app.use(express.json({ limit: '50mb' }));
 app.use(express.urlencoded({ extended: true }));


const db = require('./models/Config/config.js');

db.sequelize.sync()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log("Failed to connect db: " + err.message);
  });

  app.get("/", (req, res) => {
      console.log("server");

      res.send("server")
      
    
    })
  app.use('/user', userRoutes); 
//   app.use('/info', infoRoutes);
 

  
  app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`);
  });