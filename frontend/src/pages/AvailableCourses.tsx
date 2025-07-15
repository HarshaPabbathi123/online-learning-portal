import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AvailableCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/courses/access')
      .then((res) => setCourses(res.data))
      .catch(() => alert('Failed to load courses'));
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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                Instructor: {course.instructor?.name}
              </p>
              <Button
                className="mt-4"
                onClick={() => handleEnroll(course._id)}
              >
                Enroll
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;
