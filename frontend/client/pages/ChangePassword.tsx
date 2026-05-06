import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Lock } from 'lucide-react';
import { getAuthUser, changePassword } from '../services/api';
import { useToast } from '@/hooks/use-toast';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { username } = useParams();
  const authUser = getAuthUser() as { username?: string } | null;
  const profilePath = `/${username ?? authUser?.username ?? 'user'}/profile`;
  const [formData, setFormData] = useState({
    currentPassword: '',
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

    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === 'newPassword' || name === 'confirmPassword') {
      if (value && formData.newPassword !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in all fields' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast({ title: 'Password changed', description: 'Your password has been updated.' });
      navigate(profilePath);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Unable to change password', description: err instanceof Error ? err.message : 'Please try again later.' });
    } finally {
      setIsSaving(false);
    }
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Change Password</h1>
        <p className="text-libsmart-slate">Update your password to keep your account secure</p>
      </div>

      <div className="bg-white border border-libsmart-slate/20 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="flex items-baseline gap-2 justify-center mb-6">
            <h2 className="text-2xl font-bold text-black">LibSmart</h2>
            <p className="text-xs font-semibold text-libsmart-slate tracking-wider">LIBRARY</p>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">Secure Your Account</h3>
          <p className="text-libsmart-slate">Enter your current password and choose a new one</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-black">
              Current Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
              />
            </div>
          </div>

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
                placeholder="Enter a new password"
                className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
              />
            </div>

            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className={`flex-1 h-1 rounded-full ${strengthColor[passwordStrength]} transition-colors`} />
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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="flex-1 bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              UPDATE PASSWORD
            </Button>
            <Link to={profilePath} className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-libsmart-slate/20 text-libsmart-slate hover:bg-libsmart-slate/10 py-2.5 rounded-lg transition-all"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to={profilePath}
            className="text-sm text-libsmart-blue hover:text-libsmart-blue/80 font-medium transition-colors"
          >
            Back to profile
          </Link>
        </div>
      </div>
    </div>
  );
}