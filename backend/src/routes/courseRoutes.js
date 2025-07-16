const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { model } = require('mongoose');

// POST /api/courses - Create a course (Instructor only)
router.post('/', protect, authorizeRoles('instructor'), async (req, res) => {
  const { title, description } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/access - Public course listing
router.get('/access', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/courses/:id/enroll - Student enrolls in a course
router.post('/:id/enroll', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Prevent duplicate enrollment
    if (course.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledUsers.push(req.user._id);
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/enrolled - Get enrolled courses for the student
router.get('/enrolled', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const courses = await Course.find({ enrolledUsers: req.user._id }).populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/instructor - Courses created by logged-in instructor
router.get('/instructor', protect, authorizeRoles('instructor'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        model: 'Lesson',
      },
    })
    .populate('instructor', 'name');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ In courseRoutes.js or course controller
router.delete('/:id', protect, authorizeRoles('instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router; // ✅ Keep this LAST
