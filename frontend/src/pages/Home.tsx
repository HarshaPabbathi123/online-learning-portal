import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 text-center p-6">
      <h1 className="text-5xl font-bold mb-4 text-blue-900">📚 Online Learning Portal</h1>
      <p className="text-lg text-gray-700 mb-6">Learn, grow, and upskill from anywhere</p>
      <div className="space-x-4">
        <Button asChild><Link to="/login">Login</Link></Button>
        <Button variant="secondary" asChild><Link to="/register">Register</Link></Button>
      </div>
    </div>
  );
};

export default Home;
