
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  aiUsageCount: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });



const User = mongoose.model("User", userSchema);

// ✅ Then export
export default User;