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

  useEffect(() => {
    if (!user) return;

    if (user.role === 'student') {
      axios
        .get('http://localhost:5000/api/courses/enrolled', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setCourses(res.data));

      axios
        .get('http://localhost:5000/api/courses/access', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setAvailableCourses(res.data));
    }

    if (user.role === 'instructor') {
      axios
        .get('http://localhost:5000/api/courses/instructor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setCourses(res.data));
    }
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

          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎓 Created Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="hover:shadow-xl transition-shadow border-blue-100 border">
                  <CardContent className="p-5">
                    <h3 className="text-xl font-semibold text-blue-800">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    {course.modules?.length > 0 ? (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Modules:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {course.modules.map((mod: any) => (
                            <li key={mod._id}>{mod.title}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No modules added yet</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {user.role === 'student' && (
        <>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎓 Your Enrolled Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-10">
            {courses.map((course) => (
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
                    <p className="text-xs text-gray-500">
                      Instructor: {course.instructor?.name}
                    </p>
                    <a
                      href={`/course/${course._id}`}
                      className="mt-2 inline-block text-blue-500 underline text-sm"
                    >
                      View Course
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-purple-700 mb-6">
            🌐 Explore Available Courses
          </h2>
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
