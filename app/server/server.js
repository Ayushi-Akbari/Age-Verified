const express = require('express');
const cors = require('cors');
const userRoutes = require("./Routes/userRoutes.js")
const shopifyAuthRoutes = require("./shopify/authRoute.js")
require('dotenv').config();
const path = require("path")

const app = express();
const PORT = 8001;

app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(path.join(__dirname, "image")));

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

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