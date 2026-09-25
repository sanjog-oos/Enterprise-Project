const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true
    },
    score: {
      type:     Number,
      required: true,
      min:      0
    },
    safeDecisions:  { type: Number, default: 0 },
    totalDecisions: { type: Number, default: 0 },
    scenarioId:     { type: String, default: 'unknown', index: true },
    duration:       { type: Number, default: 0 },
    rating: {
      type:    String,
      enum:    ['Safe', 'Risky', 'Dangerous'],
      default: 'Safe'
    }
  },
  { timestamps: true }
);

AttemptSchema.pre('save', function (next) {
  if (this.score <= 2)      this.rating = 'Safe';
  else if (this.score <= 5) this.rating = 'Risky';
  else                      this.rating = 'Dangerous';
  next();
});

module.exports = mongoose.model('Attempt', AttemptSchema);