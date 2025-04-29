router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ studentId: userId })
      .populate('courseId')
      .populate('progress.lectureId');
    
    // Format the response
    const enrolledCourses = enrollments.map(enrollment => ({
      ...enrollment.courseId.toObject(),
      progress: enrollment.progress.length,
      totalLectures: enrollment.courseId.totalLectures
    }));
    
    res.json(enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
});
