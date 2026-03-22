import Lesson from '../models/Lesson.js'


export const createLesson  = async (req, res) =>{
    try {
        const { topic, days, data } = req.body;
        const newLesson = new Lesson({
          userId: req.user._id,
          topic,
          days,
          data
        });
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);
      } catch (err) {
        res.status(500).json({ error: "Failed to save lesson plan" });
      }
}

export const getLesson = async (req, res) =>{
    try {
        const lessons = await Lesson.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(lessons);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch lesson history" });
      }
}

export const deleteLesson = async (req, res) =>{
    try {
        const lesson = await Lesson.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!lesson) return res.status(404).json({ error: "Lesson not found or you are not authorized" });
        res.json({ message: "Lesson deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: "Failed to delete lesson" });
      }
}