import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddModule = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ course: '', title: '' });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/courses/instructor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((res) => setCourses(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/modules', { title: form.title, courseId: form.course }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add module');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-violet-100 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Add Module</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              className="w-full border p-2 rounded mt-1"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              required
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="title">Module Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition">
            Add Module
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddModule;
