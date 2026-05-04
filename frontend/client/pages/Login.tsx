import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in a real app, this would call an API
    if (formData.username && formData.password) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-baseline gap-2 justify-center mb-8">
            <h1 className="text-3xl font-bold text-black">LibSmart</h1>
            <p className="text-xs font-semibold text-libsmart-slate tracking-wider">LIBRARY</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-libsmart-slate/20 rounded-2xl p-8 shadow-sm">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Welcome Back !!</h2>
            <p className="text-libsmart-slate">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-black">
                Username or Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-libsmart-blue hover:text-libsmart-blue/80 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              SIGN IN
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-libsmart-slate/20" />
            <span className="text-xs text-libsmart-slate">OR</span>
            <div className="flex-1 border-t border-libsmart-slate/20" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-libsmart-slate">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-libsmart-blue hover:text-libsmart-blue/80 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-libsmart-slate/60">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
