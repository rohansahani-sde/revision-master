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
  type: {
    type: String,
    enum: ['lesson', 'flashcard'],
    default: 'lesson'
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Flexible for both lesson arrays and flashcard objects
    required: true
  }
}, { timestamps: true });


const Lesson = mongoose.model("Lesson", lessonSchema);

// ✅ Then export
export default Lesson;