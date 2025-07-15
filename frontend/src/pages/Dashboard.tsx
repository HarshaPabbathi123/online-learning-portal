import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserFromToken, clearToken } from '@/utils/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const user = getUserFromToken();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'student') {
      axios
        .get('http://localhost:5000/api/courses/enrolled', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setEnrolledCourses(res.data));

      axios
        .get('http://localhost:5000/api/courses/access')
        .then((res) => setAvailableCourses(res.data));
    }

    if (user?.role === 'instructor') {
      axios
        .get('http://localhost:5000/api/courses/instructor', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setAvailableCourses(res.data));
    }
  }, [user]);

  const handleLogout = () => {
    clearToken();
    window.location.href = '/login';
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  if (!user) return null;

  const notYetEnrolled = availableCourses.filter(
    (course) => !enrolledCourses.find((c) => c._id === course._id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-10 px-4 md:px-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-800 mb-1">
            Welcome, {user.role}
          </h1>
          <p className="text-gray-600 text-sm">
            {user.role === 'student'
              ? 'Explore available and enrolled courses'
              : 'Manage and create your courses'}
          </p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* ✅ Instructor View */}
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
            🎓 Your Created Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {availableCourses.map((course) => (
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
                    <p className="text-xs text-gray-500">
                      Modules: {course.modules?.length || 0}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ✅ Student View */}
      {user.role === 'student' && (
        <>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            🎓 Your Enrolled Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-10">
            {enrolledCourses.map((course) => (
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

          <h2 className="text-2xl font-bold text-green-700 mb-6">
            📚 Explore Available Courses
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {notYetEnrolled.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="hover:shadow-md border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-green-800">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{course.description}</p>
                    <p className="text-xs text-gray-500">
                      Instructor: {course.instructor?.name}
                    </p>
                    <Button
                      className="mt-3"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll Now
                    </Button>
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
