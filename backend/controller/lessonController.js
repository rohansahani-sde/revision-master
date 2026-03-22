import Lesson from '../models/Lesson.js'


export const createLesson  = async (req, res) =>{
    try {
    const { topic, days, data, type } = req.body;
    const newLesson = new Lesson({
      userId: req.user._id,
      topic,
      days,
      type: type || 'lesson',
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
    const { type } = req.query;
    const query = { userId: req.user._id };
    if (type) query.type = type;
    const lessons = await Lesson.find(query).sort({ createdAt: -1 });
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