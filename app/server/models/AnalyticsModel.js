const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnalyticsSchema = new mongoose.Schema(
  {
    shop_id: {
      type: Schema.Types.ObjectId,
    },
    market: [
      {
        id: {
        type: Schema.Types.ObjectId,
      },
      verified: [
        {
          _id: false,
          time: {
            type: Date,
            required: true,
          },
          count: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      unverified: [
        {
          _id: false,
          time: {
            type: Date,
            required: true,
          },
          count: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      }
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const AnalyticsModel = mongoose.model("Analytics", AnalyticsSchema);

module.exports = AnalyticsModel;
