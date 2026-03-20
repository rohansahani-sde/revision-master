const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  data: {
    type: Array, // Full lesson JSON
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
