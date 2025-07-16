import React from 'react';

interface LessonProps {
  title: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
}

const LessonViewer: React.FC<{ lesson: LessonProps }> = ({ lesson }) => {
  const convertToEmbedUrl = (url: string) => {
    if (!url.includes('youtube.com/watch')) return url;
    const videoId = new URLSearchParams(new URL(url).search).get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-3xl font-bold">{lesson.title}</h2>
      <p className="text-gray-700 text-lg">{lesson.content}</p>

      {lesson.videoUrl && (
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded"
            src={convertToEmbedUrl(lesson.videoUrl)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Lesson Video"
          />
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
