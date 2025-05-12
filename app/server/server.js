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
      // const { shop } = req.params;
      // if (!shop) {
      //   return res.status(400).send('Shop parameter is required');
      // }
    
      const state = crypto.randomBytes(16).toString('hex');
      console.log("state : ", state);
      
      req.session.state = state;
    
      const scopes = 'read_products,write_products';
    
      const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${SHOPIFY_REDIRECT_URI}&state=${state}`;
    
      res.redirect(authUrl);
    })
  app.use('/user', userRoutes); 
//   app.use('/info', infoRoutes);
 

  
  app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`);
  });