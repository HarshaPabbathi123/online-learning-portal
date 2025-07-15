const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Create Module (Instructor only)
router.post('/', protect, authorizeRoles('instructor'), async (req, res) => {
  const { title, courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const module = await Module.create({ title, course: courseId });
    course.modules.push(module._id);
    await course.save();

    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Lesson to Module (Instructor only)
router.post('/:id/lessons', protect, authorizeRoles('instructor'), async (req, res) => {
  const { title, content, videoUrl } = req.body;
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const lesson = await Lesson.create({ title, content, videoUrl, module: module._id });
    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View Modules & Lessons (Enrolled Students only)
router.get('/course/:id', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const isEnrolled = course.enrolledUsers.includes(req.user._id);
    if (!isEnrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

    const modules = await Module.find({ course: req.params.id }).populate('lessons');
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
