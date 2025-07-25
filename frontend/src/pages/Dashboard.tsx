import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserFromToken } from '@/utils/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const user = getUserFromToken();
  const [courses, setCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (user.role === 'student') {
        const [enrolledRes, allRes, completedRes] = await Promise.all([
          axios.get('http://localhost:5000/api/courses/enrolled', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/courses/access', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/progress/completed-ids', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCourses(enrolledRes.data);
        const enrolledIds = new Set(enrolledRes.data.map((c: any) => c._id));
        setAvailableCourses(allRes.data.filter((c: any) => !enrolledIds.has(c._id)));
        setCompletedIds(completedRes.data);
      }

      if (user.role === 'instructor') {
        const res = await axios.get('http://localhost:5000/api/courses/instructor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Enrolled successfully!');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Lesson deleted');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
  if (!window.confirm('Are you sure you want to delete this course?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    alert('Course deleted successfully!');
    window.location.reload();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete course');
  }
};

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-10 px-4 md:px-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-800 mb-1">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 text-sm">
            {user.role === 'student'
              ? 'Explore your enrolled and available courses below'
              : 'Manage and create courses'}
          </p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {user.role === 'instructor' && (
        <>
          <div className="flex gap-4 mb-10">
            <Button asChild>
              <a href="/create-course">➕ Create Course</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/add-module">📦 Add Module</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/add-lesson">🎥 Add Lesson</a>
            </Button>
          </div>

          <h2 className="text-2xl font-bold text-blue-700 mb-6">🎓 Created Courses</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="hover:shadow-xl transition-shadow border-blue-100 border">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-blue-800">{course.title}</h3>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div>
                      <p className="font-medium mt-3">Modules:</p>
                      <ul className="text-sm space-y-2">
                        {course.modules?.map((mod: any) => (
                          <li key={mod._id}>
                            <button
                              className="text-purple-700 underline"
                              onClick={() =>
                                setExpandedModuleId((prev) =>
                                  prev === mod._id ? null : mod._id
                                )
                              }
                            >
                              {expandedModuleId === mod._id ? '▾' : '▸'} {mod.title}
                            </button>
                            {expandedModuleId === mod._id && (
                              <ul className="ml-5 list-disc text-green-600 mt-1">
                                {(mod.lessons || []).map((lesson: any) => (
                                  <li
                                    key={lesson._id}
                                    className="flex justify-between items-center gap-2"
                                  >
                                    <span>{lesson.title}</span>
                                    <button
                                      onClick={() => handleDeleteLesson(lesson._id)}
                                      className="text-red-600 text-xs hover:underline"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {user.role === 'student' && (
        <>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">🎓 Your Enrolled Courses</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-10">
            {courses.map((course) => {
              const totalLessons = course.modules?.reduce(
                (acc: number, mod: any) => acc + ((mod.lessons || []).length),
                0
              );
              const completedCount = course.modules?.reduce(
                (acc: number, mod: any) =>
                  acc + (mod.lessons || []).filter((lesson: any) =>
                    completedIds.includes(lesson._id)
                  ).length,
                0
              );

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="hover:shadow-md border-gray-200">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-blue-800">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{course.description}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        Instructor: {course.instructor?.name}
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(completedCount / totalLessons) * 100 || 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {completedCount} of {totalLessons} lessons completed
                      </p>

                      <a
                        href={`/course/${course._id}`}
                        className="inline-block text-blue-500 underline text-sm mt-2"
                      >
                        View Course
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-purple-700 mb-6">🌐 Explore Available Courses</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {availableCourses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="hover:shadow-lg border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-indigo-800">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{course.description}</p>
                    <p className="text-xs text-gray-500">
                      Instructor: {course.instructor?.name}
                    </p>
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Enroll
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
