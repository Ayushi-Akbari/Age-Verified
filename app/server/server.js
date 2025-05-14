const express = require('express');
const cors = require('cors');
const userRoutes = require("./Routes/userRoutes.js")
const shopifyAuthRoutes = require("./shopify/authRoute.js")
require('dotenv').config();

const app = express();
const PORT = 8001;

app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const db = require('./models/Config/config.js');

db.sequelize.sync()
  .then(() => console.log("Database connected."))
  .catch(err => console.log("DB connection failed: " + err.message));

  app.get("/", (req, res) => res.send("server"));
  app.use('/user', userRoutes); 
  app.use('/', shopifyAuthRoutes);
 
  app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`);
  });