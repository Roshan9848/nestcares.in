import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';
import { 
  ShieldCheck, Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, 
  ShieldAlert, RefreshCw, CheckCircle, Shield
} from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'doctor'
  const [email, setEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoSrc, setLogoSrc] = useState('/logo.png');

  // Load brand logo settings
  useEffect(() => {
    const settingsStr = localStorage.getItem('mock_settings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings?.web?.logoUrl) {
          const url = settings.web.logoUrl;
          if (url.startsWith('/')) {
            setLogoSrc(url === '/logo.png' ? '/logo.png' : resolveImageUrl(url));
          } else {
            setLogoSrc(url);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Auth redirects
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const docToken = localStorage.getItem('doctor_token');
    if (docToken) {
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (loginType === 'admin') {
      if (!email || !password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } else {
      if (!doctorId || !password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      const doctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
      const match = doctors.find(
        d => d && d.doctorId?.toLowerCase() === doctorId.trim().toLowerCase() && d.password === password
      );

      setLoading(false);
      if (match) {
        localStorage.setItem('doctor_token', 'mock-doctor-token-' + Date.now());
        localStorage.setItem('doctor_user', JSON.stringify(match));
        navigate('/doctor/dashboard');
      } else {
        setError('Invalid Doctor ID or password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08111F] to-[#111827] flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Subtle radial backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Left Return Link - Clean ghost pill button */}
      <div className="absolute top-8 left-8 sm:left-12">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/[0.02] border border-white/5 hover:border-white/10 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>Return to website</span>
        </Link>
      </div>

      {/* Centered Login Card Container (Width: 500-560px) */}
      <div className="w-full max-w-[520px] bg-[#111827]/70 backdrop-blur-2xl border border-white/[0.06] rounded-[24px] p-8 sm:p-12 shadow-2xl flex flex-col gap-8 relative z-10">
        
        {/* Transparent Logo Block */}
        <div className="flex justify-center">
          {logoSrc ? (
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="h-10 w-auto object-contain brightness-110" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl">
              <Shield className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Welcome titles */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl sm:text-[38px] font-bold text-white tracking-tight leading-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">
            Access your secure healthcare administration portal.
          </p>
        </div>

        {/* Modern Segmented Tab controls */}
        <div className="flex bg-[#08111F]/80 p-1.5 rounded-2xl border border-white/[0.06] shadow-inner">
          <button
            type="button"
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              loginType === 'admin' 
                ? 'bg-[#14B8A6] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Console
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('doctor');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              loginType === 'doctor' 
                ? 'bg-[#14B8A6] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clinician Portal
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 text-xs p-4 rounded-2xl text-left leading-relaxed font-semibold flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Inputs form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {loginType === 'admin' ? (
            /* Email Input */
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#14B8A6] transition-colors">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nestcares.in"
                  className="w-full h-14 pl-12 pr-4 bg-[#08111F]/60 border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] focus:bg-[#08111F] transition-all text-white placeholder-slate-700 text-xs font-medium shadow-inner"
                />
              </div>
            </div>
          ) : (
            /* Doctor ID Input */
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Clinician Badge ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#14B8A6] transition-colors">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC-101"
                  className="w-full h-14 pl-12 pr-4 bg-[#08111F]/60 border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] focus:bg-[#08111F] transition-all text-white placeholder-slate-700 text-xs font-medium shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
              Security Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#14B8A6] transition-colors">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-12 bg-[#08111F]/60 border border-white/[0.06] rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] focus:bg-[#08111F] transition-all text-white placeholder-slate-700 text-xs font-medium shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember & Reset Session Options */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 select-none pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/[0.06] bg-[#08111F]/80 text-[#14B8A6] focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
              />
              <span>Remember session</span>
            </label>
            <button 
              type="button"
              onClick={() => alert('Please contact administrative coordinator to reset login password.')}
              className="hover:text-[#14B8A6] transition-colors"
            >
              Reset access?
            </button>
          </div>

          {/* Solid Teal Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#14B8A6] hover:bg-[#0F766E] disabled:bg-[#08111F] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authorizing Access...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Small Inline Security badges */}
        <div className="flex items-center justify-center gap-6 border-t border-white/[0.06] pt-6 select-none text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Secure Access</span>
          </div>
        </div>

      </div>

      {/* Live system state text indicator */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600 select-none">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span>Nest Cares Node-04 Online</span>
      </div>

    </div>
  );
};

export default Login;
