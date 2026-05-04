import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'username' | 'otp'>('username');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter your username or email');
      return;
    }

    // Mock OTP sending
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    // Mock OTP verification - redirect to reset password
    navigate('/reset-password');
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('username');
      setOtp('');
    } else {
      navigate('/login');
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
            <h2 className="text-2xl font-bold text-black mb-2">Reset Password</h2>
            <p className="text-libsmart-slate">
              {step === 'username'
                ? 'Enter your username or email to receive an OTP'
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            <div
              className={`h-2 w-8 rounded-full transition-colors ${
                step === 'username' ? 'bg-libsmart-blue' : 'bg-libsmart-slate/20'
              }`}
            />
            <div
              className={`h-2 w-8 rounded-full transition-colors ${
                step === 'otp' ? 'bg-libsmart-blue' : 'bg-libsmart-slate/20'
              }`}
            />
          </div>

          {/* Form */}
          {step === 'username' && (
            <form onSubmit={handleUsernameSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-black">
                  Please enter your username
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-libsmart-slate/50" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full pl-10 pr-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* OTP Field */}
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-black">
                  Enter OTP
                </label>
                <p className="text-xs text-libsmart-slate mb-3">
                  We've sent a 6-digit code to your registered email
                </p>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-libsmart-slate/20 rounded-lg bg-white text-black text-center text-2xl tracking-widest placeholder-libsmart-slate/50 focus:outline-none focus:ring-2 focus:ring-libsmart-blue focus:border-transparent transition-all"
                />
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <span className="text-sm text-libsmart-slate">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={() => setOtp('')}
                    className="text-libsmart-blue hover:text-libsmart-blue/80 font-medium transition-colors"
                  >
                    Resend
                  </button>
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-libsmart-blue hover:bg-libsmart-blue/90 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                Verify OTP
              </Button>
            </form>
          )}

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mt-6 w-full flex items-center justify-center gap-2 text-libsmart-blue hover:text-libsmart-blue/80 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-libsmart-blue hover:text-libsmart-blue/80 font-medium transition-colors"
          >
            Remember your password? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
