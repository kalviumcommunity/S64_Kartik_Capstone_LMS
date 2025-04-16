const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Sample hardcoded courses
const courses = [
  { id: 1, title: "Web Development", description: "Learn HTML, CSS, JS" },
  { id: 2, title: "React Basics", description: "Intro to React components and hooks" },
  { id: 3, title: "Node.js Backend", description: "Build backend APIs using Node and Express" }
];

// GET endpoint
app.get('/api/courses', (req, res) => {
  res.status(200).json(courses);
});

// POST endpoint to add a new course
app.post('/api/courses', (req, res) => {
    const { title, description } = req.body;
  
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
  
    const newCourse = {
      id: courses.length + 1,
      title,
      description,
    };
  
    courses.push(newCourse);
    res.status(201).json(newCourse);
  });
  
// PUT endpoint to update a course
app.put('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const { title, description } = req.body;
  
    const courseIndex = courses.findIndex(course => course.id === courseId);
  
    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }
  
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
  
    courses[courseIndex] = {
      id: courseId,
      title,
      description
    };
  
    res.status(200).json(courses[courseIndex]);
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
