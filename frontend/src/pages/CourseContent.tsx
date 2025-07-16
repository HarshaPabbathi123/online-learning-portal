import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from '@tanstack/react-router';
import { motion } from 'framer-motion';

const CourseContent = () => {
  const { courseId } = useParams({ from: '/course/$courseId' });
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setModules(res.data))
      .catch((err) => alert(err.response?.data?.message || 'Access Denied'));
  }, [courseId]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        📚 Course Content
      </h1>

      {modules.map((mod) => (
        <motion.div
          key={mod._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-purple-600 mb-4 border-l-4 border-purple-500 pl-3">
            📦 {mod.title}
          </h2>
          <div className="grid gap-4">
            {mod.lessons.map((lesson: any) => (
              <div
                key={lesson._id}
                className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">📘 {lesson.title}</h3>
                <p className="text-gray-600 mb-3">{lesson.content}</p>
                {lesson.videoUrl && (
                  <div className="aspect-video rounded overflow-hidden border border-gray-300">
                    <iframe
                      src={lesson.videoUrl.includes('youtube.com/watch')
                        ? `https://www.youtube.com/embed/${new URLSearchParams(
                            new URL(lesson.videoUrl).search
                          ).get('v')}`
                        : lesson.videoUrl}
                      title="Lesson Video"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseContent;
