import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const AvailableCourses = () => {
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/courses/access', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setAvailableCourses(res.data))
      .catch((err) => alert(err.response?.data?.message || 'Failed to fetch courses'));
  }, []);

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
      alert('Enrolled successfully!');
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-8 flex items-center gap-2">
        <span className="text-4xl">📚</span> Available Courses
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {availableCourses.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>

                <p className="text-sm text-gray-500">
                  Instructor:{' '}
                  <span className="text-purple-600 font-medium">
                    {course.instructor?.name || 'Unknown'}
                  </span>
                </p>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleEnroll(course._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded"
                  >
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;
