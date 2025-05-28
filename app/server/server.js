const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require("path")
const userModel = require("./models/UserModel.js")
const settingModel = require("./models/SettingModel.js")
const analyticsModel = require("./models/AnalyticsModel.js")
const { settingRoute, userRoute, analyticsRoute, WebhookRoute } = require("./Routes/index.js");
const app = express();
const PORT = 8001;

app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(path.join(__dirname, "image")));

app.use("/user", userRoute)
app.use("/setting", settingRoute)
app.use("/analytics", analyticsRoute);
app.use("/hooks", WebhookRoute);

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

const db = require('./models/Config/config.js');; 
 
  app.listen(PORT, () => {
    console.log(`app running on PORT ${PORT}`);
  });