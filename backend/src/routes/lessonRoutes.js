const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ✅ Update Lesson
router.put('/:id', protect, authorizeRoles('instructor'), async (req, res) => {
  const { title, content, videoUrl, pdfUrl } = req.body;

  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.pdfUrl = pdfUrl || lesson.pdfUrl;

    const updated = await lesson.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/lessons/:id
router.delete('/:id', protect, authorizeRoles('instructor'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Remove the lesson reference from its module (if exists)
    await Module.updateOne(
      { lessons: lesson._id },
      { $pull: { lessons: lesson._id } }
    );

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error('Error deleting lesson:', err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});


module.exports = router;
