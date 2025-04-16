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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
