import mongoose from 'mongoose'

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


const Lesson = mongoose.model("Lesson", lessonSchema);

// ✅ Then export
export default Lesson;