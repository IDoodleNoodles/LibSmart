import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, Check } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const checkPasswordStrength = (password: string) => {
    if (!password) return 'weak';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length;

    if (strengthScore >= 4) return 'strong';
    if (strengthScore >= 2) return 'medium';
    return 'weak';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Check password match
    if (name === 'newPassword' || name === 'confirmPassword') {
      if (value && formData.newPassword !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Mock password reset - in a real app, this would call an API
    navigate('/login');
  };

  const strengthColor = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthText = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
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
            <h2 className="text-2xl font-bold text-black mb-2">Reset Password</h2>
            <p className="text-libsmart-slate">Create a new password for your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                New Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                  className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 h-1 rounded-full ${strengthColor[passwordStrength]} transition-colors`}
                    />
                    <div
                      className={`flex-1 h-1 rounded-full ${
                        ['medium', 'strong'].includes(passwordStrength)
                          ? strengthColor[passwordStrength]
                          : 'bg-libsmart-slate/20'
                      } transition-colors`}
                    />
                    <div
                      className={`flex-1 h-1 rounded-full ${
                        passwordStrength === 'strong'
                          ? strengthColor[passwordStrength]
                          : 'bg-libsmart-slate/20'
                      } transition-colors`}
                    />
                  </div>
                  <p className="text-xs text-libsmart-slate">
                    Password strength: <span className="font-medium">{strengthText[passwordStrength]}</span>
                  </p>
                </div>
              )}

              {/* Password Requirements */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-libsmart-slate">Password should contain:</p>
                <ul className="text-xs text-libsmart-slate space-y-1">
                  <li className="flex items-center gap-2">
                    <Check size={14} className={formData.newPassword.length >= 8 ? 'text-green-500' : 'text-libsmart-slate/30'} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className={/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-libsmart-slate/30'} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className={/[a-z]/.test(formData.newPassword) ? 'text-green-500' : 'text-libsmart-slate/30'} />
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className={/\d/.test(formData.newPassword) ? 'text-green-500' : 'text-libsmart-slate/30'} />
                    One number
                  </li>
                </ul>
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

            {/* Reset Button */}
            <Button
              type="submit"
              className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              RESET PASSWORD
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-libsmart-slate/20" />
            <span className="text-xs text-libsmart-slate">OR</span>
            <div className="flex-1 border-t border-libsmart-slate/20" />
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-libsmart-slate">
            Remember your password?{' '}
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
