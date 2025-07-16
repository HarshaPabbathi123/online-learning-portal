const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ✅ Mark a lesson as completed
router.post('/lessons/:id/complete', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.completedLessons.includes(req.params.id)) {
      user.completedLessons.push(req.params.id);
      await user.save();
    }

    res.json({ message: 'Lesson marked as completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get completed lessons (for dashboard or lesson viewer)
router.get('/completed-ids', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.completedLessons); // Array of ObjectIds
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
