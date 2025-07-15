import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from '@tanstack/react-router';

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

  const getEmbedUrl = (url: string) => {
    try {
      const videoId = new URLSearchParams(new URL(url).search).get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Course Content</h2>

      {modules.map((mod) => (
        <div key={mod._id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-700">{mod.title}</h3>
          <ul className="pl-4 space-y-1">
            {mod.lessons.map((lesson: any) => (
              <li key={lesson._id} className="border p-3 rounded">
                <strong>{lesson.title}</strong>
                <p>{lesson.content}</p>
                {lesson.videoUrl && (
                  <div className="mt-3 aspect-video">
                    <iframe
                      src={getEmbedUrl(lesson.videoUrl)}
                      title="Lesson Video"
                      className="w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;
