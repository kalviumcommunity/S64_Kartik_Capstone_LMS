import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');
  
  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set user object with _id instead of id
    req.user = {
      ...decoded,
      _id: decoded.id // Map id to _id for MongoDB compatibility
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export { protect };