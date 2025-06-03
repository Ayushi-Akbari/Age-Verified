const mongoose = require("mongoose");
const { Schema } = mongoose;

const SettingSchema = new mongoose.Schema({
  shop_id: {
    type: Schema.Types.ObjectId,
  },
  shop_name: {
    type: String,
  },
  settings: {
    type: Object,
    default: {}
  },
  html_content: {
    type: String,
  },
  is_enable: {
    type: Boolean,
  },
  primary: {
    type: Boolean,
  },
  country: {
    type: String,
  },
  language: {
    type: String
  }
});

const SettingModel = mongoose.model("Setting", SettingSchema);


module.exports = SettingModel;