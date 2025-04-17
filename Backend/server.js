const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course'); 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Sample hardcoded courses
// const courses = [
//   { id: 1, title: "Web Development", description: "Learn HTML, CSS, JS" },
//   { id: 2, title: "React Basics", description: "Intro to React components and hooks" },
//   { id: 3, title: "Node.js Backend", description: "Build backend APIs using Node and Express" }
// ];

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// GET endpoint
// app.get('/api/courses', (req, res) => {
//   res.status(200).json(courses);
// });

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

// POST endpoint to add a new course
// app.post('/api/courses', (req, res) => {
//     const { title, description } = req.body;
  
//     if (!title || !description) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
  
//     const newCourse = {
//       id: courses.length + 1,
//       title,
//       description,
//     };
  
//     courses.push(newCourse);
//     res.status(201).json(newCourse);
//   });
app.post('/api/courses', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newCourse = new Course({
    title,
    description
  });

  try {
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error saving course', error: err.message });
  }
});  

// PUT endpoint to update a course
// app.put('/api/courses/:id', (req, res) => {
//     const courseId = parseInt(req.params.id);
//     const { title, description } = req.body;
  
//     const courseIndex = courses.findIndex(course => course.id === courseId);
  
//     if (courseIndex === -1) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
  
//     if (!title || !description) {
//       return res.status(400).json({ message: 'Title and description are required' });
//     }
  
//     courses[courseIndex] = {
//       id: courseId,
//       title,
//       description
//     };
  
//     res.status(200).json(courses[courseIndex]);
//   });
app.put('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
