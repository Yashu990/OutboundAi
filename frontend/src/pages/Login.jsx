import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      setAuth(true);
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-[1100px] flex bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10 mx-4 border border-gray-100">
        {/* Left Side: Branding/Content */}
        <div className="hidden lg:flex w-1/2 bg-brand p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">SALES AUTOMATOR</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-6">
              Empower your sales team with <span className="text-blue-200 underline decoration-blue-300">AI precision</span>.
            </h2>
            <p className="text-blue-100 text-lg">
              Automate lead discovery, personalize outreach, and close deals faster than ever before.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2 rounded-lg mt-1"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold">Enterprise Security</h4>
                <p className="text-sm text-blue-100/80">Your data is encrypted and protected with industry-best practices.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-xs text-blue-100/50">© 2026 Sales Automator CRM Platform. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-500">Please enter your credentials to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-gray-900"
                  placeholder="alex@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-bold text-brand hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded text-brand focus:ring-brand cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">Keep me logged in for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-black py-4 rounded-2xl shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <a href="#" className="text-brand font-bold hover:underline">Request Access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
