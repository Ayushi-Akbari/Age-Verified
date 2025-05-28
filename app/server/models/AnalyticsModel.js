const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnalyticsSchema = new mongoose.Schema({
  shop_id: {
    type: Schema.Types.ObjectId,
  },
  verified: [
    {
      time: {
        type: Date,
        required: true
      },
      count: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ],
  unverified: [
    {
      time: {
        type: Date,
        required: true
      },
      count: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

AnalyticsSchema.path('verified').schema.set('_id', false);
AnalyticsSchema.path('unverified').schema.set('_id', false);

const AnalyticsModel = mongoose.model('Analytics', AnalyticsSchema);

module.exports = AnalyticsModel;
