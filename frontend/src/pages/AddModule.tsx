
// ✅ AddModule.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddModule = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/instructor', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setCourses(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/modules', { title, courseId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add module');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Module</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="course">Course</Label>
          <select id="course" className="w-full border p-2 rounded" onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="title">Module Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Add Module</Button>
      </form>
    </div>
  );
};

export default AddModule;