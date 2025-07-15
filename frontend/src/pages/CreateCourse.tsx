
// ✅ CreateCourse.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/courses',
        { title, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <Button type="submit" className="w-full">Create</Button>
      </form>
    </div>
  );
};

export default CreateCourse;