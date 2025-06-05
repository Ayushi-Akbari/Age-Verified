const mongoose = require("mongoose");
const { Schema } = mongoose;

const MarketSchema = new mongoose.Schema({
  shop_id: {
    type: Schema.Types.ObjectId,
  },
  shop_name: {
    type: String,
  },
  market: [
    {
      flag: {
        type: String,
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
    }
  ],
});

const MarketModel = mongoose.model("Market", MarketSchema);


module.exports = MarketModel;