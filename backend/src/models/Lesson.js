const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);
