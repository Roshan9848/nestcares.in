import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { resolveImageUrl } from '../utils/url';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'doctor'
  const [email, setEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoSrc, setLogoSrc] = useState('/logo.png');

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

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Redirect if already logged in as doctor
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
        setError(res.message || 'Invalid email or password.');
      }
    } else {
      // Doctor login
      if (!doctorId || !password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      // Check doctor credentials against mockDb
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
    <div className="bg-gradient-to-br from-slate-900 via-[#070b14] to-slate-950 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-md w-full">
        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>

        {/* Login Box */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col gap-6">
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-2xl flex items-center justify-center h-16 w-auto max-w-[200px]">
              <img src={logoSrc} alt="Nest Cares" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-2 uppercase tracking-wide">Command Center</h1>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase font-extrabold">Supervised Healthcare Portal</p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-850">
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError('');
              }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                loginType === 'admin' ? 'bg-teal-950/80 text-teal-400 border border-teal-500/20 shadow-md shadow-teal-500/5' : 'text-slate-550 hover:text-slate-300'
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
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                loginType === 'doctor' ? 'bg-teal-950/80 text-teal-400 border border-teal-500/20 shadow-md shadow-teal-500/5' : 'text-slate-550 hover:text-slate-300'
              }`}
            >
              Doctor Portal
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 text-xs p-3.5 rounded-xl text-left leading-relaxed font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {loginType === 'admin' ? (
              /* Email Field */
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>Admin Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@carehome.com"
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-700 text-xs font-semibold"
                />
              </div>
            ) : (
              /* Doctor ID Field */
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>Clinician Doctor ID</span>
                </label>
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC-101"
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-700 text-xs font-semibold"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Security Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950/40 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-700 text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-850 hover:bg-teal-900 disabled:bg-slate-800 text-white font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 text-xs mt-6 border border-teal-700/50 cursor-pointer shadow-lg shadow-teal-950/20"
            >
              {loading ? (
                <span>Validating Coordinates...</span>
              ) : (
                <>
                  <span>{loginType === 'admin' ? 'Log In to Console' : 'Access Patient Queue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1 text-[8px] text-slate-600 border-t border-slate-850 pt-4 mt-2 font-black uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Secure SSL Encrypted Clinical Session</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
