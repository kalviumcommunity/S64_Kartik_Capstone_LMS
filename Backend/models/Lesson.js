import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
