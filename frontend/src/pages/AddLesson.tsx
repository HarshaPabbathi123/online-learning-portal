import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddLesson = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<any[]>([]);
  const [form, setForm] = useState({
    moduleId: '',
    title: '',
    content: '',
    videoUrl: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/instructor', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const allModules = res.data.flatMap((course: any) => course.modules || []);
      setModules(allModules);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/modules/${form.moduleId}/lessons`, {
      title: form.title,
      content: form.content,
      videoUrl: form.videoUrl
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-100 to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-violet-700 mb-6">Add Lesson</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="moduleId">Module</Label>
            <select
              id="moduleId"
              className="w-full border p-2 rounded mt-1"
              value={form.moduleId}
              onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
              required
            >
              <option value="">Select a module</option>
              {modules.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>

          <div>
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input id="videoUrl" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          </div>

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 transition">
            Add Lesson
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
