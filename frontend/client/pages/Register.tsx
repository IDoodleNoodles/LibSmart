import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { register } from '@/services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password' || name === 'confirmPassword') {
      if (value && formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
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
            <h2 className="text-2xl font-bold text-black mb-2">Create Account</h2>
            <p className="text-libsmart-slate">Join LibSmart today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-black">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-black">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
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
                  placeholder="Enter a strong password"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordError
                      ? 'border-red-300 focus:ring-red-300'
                      : 'border-libsmart-slate/20 focus:ring-libsmart-blue'
                  }`}
                />
              </div>
              {passwordError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  {passwordError}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 border-libsmart-slate/20 rounded accent-libsmart-blue cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-libsmart-slate cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-libsmart-blue hover:text-libsmart-blue/80 font-medium">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-libsmart-blue hover:text-libsmart-blue/80 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-libsmart-slate/20" />
            <span className="text-xs text-libsmart-slate">OR</span>
            <div className="flex-1 border-t border-libsmart-slate/20" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-libsmart-slate">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-libsmart-blue hover:text-libsmart-blue/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
