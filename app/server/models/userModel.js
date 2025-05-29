const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /.+\@.+\..+/ 
  },
  token_id:{
    type: String
  },
  shop_id: {
    type: String
  },
  shop_name: {
    type: String
  },
  owner_name: {
    type: String
  },
  country_code: {
    type: String
  },
  plan_displayName: {
    type: String
  },
  plan_partnerDevelopment: {
    type: Boolean
  },
  plan_shopifyPlus: {
    type: Boolean
  },
  currency_code: {
    type: String
  },
  currency_format: {
    type: String
  },
  timezoneAbbreviation: {
    type: String
  },
  ianaTimezone: {
    type: String
  },
  host: {
    type: String
  },
  shopLocales_primary: {
    type: Boolean
  },
  shopLocales_locale: {
    type: String
  },
  theme_id: {
    type: String
  },
  app_uninstall: {
    type: Boolean,
    default: false
  },
  app_uninstall_time: {
    type: Date
  },
});

const UserModel = mongoose.model("User", UserSchema);


module.exports = UserModel;