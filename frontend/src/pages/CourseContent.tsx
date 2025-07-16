import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from '@tanstack/react-router';

const CourseContent = () => {
  const { courseId } = useParams({ from: '/course/$courseId' });
  const [modules, setModules] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setModules(res.data));

    axios
      .get('http://localhost:5000/api/progress/completed', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const completedIds = res.data.map((lesson: any) => lesson._id);
        setCompletedLessons(completedIds);
      });
  }, [courseId]);

  const markComplete = async (lessonId: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/progress/lessons/${lessonId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedLessons([...completedLessons, lessonId]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark as complete');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📘 Course Content</h2>

      {modules.map((mod) => (
        <div key={mod._id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-700">{mod.title}</h3>
          <ul className="pl-4 space-y-3">
            {mod.lessons.map((lesson: any) => {
              const isCompleted = completedLessons.includes(lesson._id);
              return (
                <li
                  key={lesson._id}
                  className={`border p-4 rounded ${isCompleted ? 'bg-green-50 border-green-400' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">
                      {lesson.title} {isCompleted && <span className="text-green-600 text-sm">✅</span>}
                    </h4>
                    {!isCompleted && (
                      <button
                        className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => markComplete(lesson._id)}
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{lesson.content}</p>

                  {lesson.videoUrl && (
                    <iframe
                      src={lesson.videoUrl}
                      className="w-full h-64 rounded"
                      allowFullScreen
                      title="Lesson Video"
                    />
                  )}

                  {lesson.pdfUrl && (
                    <div className="mt-2">
                      <a
                        href={`http://localhost:5000${lesson.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 underline"
                      >
                        📄 View PDF
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;
