import Course from '../models/Course.js';

export const addCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, status } = req.body;
    const educator = req.user._id; // assuming you use auth middleware

    const newCourse = new Course({
      title,
      description,
      price,
      thumbnail,
      status,
      educator
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};
