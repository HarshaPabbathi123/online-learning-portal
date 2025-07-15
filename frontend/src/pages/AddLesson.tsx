// ✅ AddLesson.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddLesson = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [moduleId, setModuleId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/instructor', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => {
      const allModules = res.data.flatMap((course: any) => course.modules || []);
      setModules(allModules);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/modules/${moduleId}/lessons`,
        { title, content, videoUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Lesson</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="module">Module</Label>
          <select id="module" className="w-full border p-2 rounded" onChange={(e) => setModuleId(e.target.value)}>
            <option value="">Select a module</option>
            {modules.map(mod => (
              <option key={mod._id} value={mod._id}>{mod.title}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="title">Lesson Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="video">Video URL (optional)</Label>
          <Input id="video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </div>

        <Button type="submit" className="w-full">Add Lesson</Button>
      </form>
    </div>
  );
};

export default AddLesson;
