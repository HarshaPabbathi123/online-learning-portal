import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from '@tanstack/react-router';
import LessonViewer from './LessonViewer'; // If you want to show selected lesson in detail

const CourseContent = () => {
  const { courseId } = useParams({ from: '/course/$courseId' });
  const [modules, setModules] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setModules(res.data))
      .catch((err) => alert(err.response?.data?.message || 'Access Denied'));
  }, [courseId]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-8">📘 Course Content</h2>

      {modules.map((mod) => (
        <div key={mod._id} className="mb-8 bg-white shadow rounded p-6">
          <h3 className="text-2xl font-semibold text-purple-700 mb-3">{mod.title}</h3>
          <p className="text-gray-600 mb-4">{mod.description}</p>

          {mod.lessons.length > 0 ? (
            <ul className="space-y-3">
              {mod.lessons.map((lesson: any) => (
                <li
                  key={lesson._id}
                  className="border border-gray-200 rounded p-4 hover:shadow-md transition cursor-pointer bg-gray-50"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <h4 className="text-lg font-medium text-blue-700">{lesson.title}</h4>
                  <p className="text-sm text-gray-600">{lesson.content?.slice(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No lessons yet in this module.</p>
          )}
        </div>
      ))}

      {selectedLesson && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">🎥 Lesson</h2>
          <LessonViewer lesson={selectedLesson} />
        </div>
      )}
    </div>
  );
};

export default CourseContent;
