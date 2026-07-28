import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';
import { 
  ShieldCheck, Mail, Lock, ArrowLeft, ArrowRight, Activity, 
  Eye, EyeOff, ShieldAlert, Cpu, Heart, CheckCircle2, RefreshCw 
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

  // Load custom logo
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

  // Redirect if logged in
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
    <div className="min-h-screen bg-[#070B14] flex flex-col lg:flex-row text-slate-200 relative overflow-hidden font-sans">
      
      {/* Animated background radial glow decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* LEFT SIDE: 3D-effect Healthcare Graphics (45%) */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#080d19]/85 border-r border-white/5 flex-col justify-between p-12 relative overflow-hidden shrink-0 select-none">
        
        {/* Ambient grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        
        {/* Branding header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-teal-500/15 border border-teal-500/30 rounded-2xl text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-slate-400 uppercase">Nest Cares</div>
            <div className="text-[9px] text-teal-400 font-extrabold uppercase mt-0.5 tracking-widest">Enterprise Console</div>
          </div>
        </div>

        {/* Center graphics area: Animated Heartbeat / ECG line */}
        <div className="my-auto relative flex flex-col items-center justify-center min-h-[320px] z-10 w-full">
          
          {/* Glowing pulse rings */}
          <div className="absolute w-44 h-44 border border-teal-500/10 rounded-full animate-ping pointer-events-none"></div>
          <div className="absolute w-72 h-72 border border-blue-500/5 rounded-full animate-pulse pointer-events-none"></div>

          {/* SVG Animated Heartbeat Line */}
          <svg className="w-full h-44 text-teal-400/80 drop-shadow-[0_0_8px_rgba(0,229,168,0.3)]" viewBox="0 0 600 150">
            <path
              d="M 0,75 L 180,75 L 200,45 L 215,115 L 230,25 L 245,125 L 260,75 L 600,75"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[dash_3s_linear_infinite]"
              style={{
                strokeDasharray: '600',
                strokeDashoffset: '600',
                animation: 'ecgGlow 2.5s infinite linear'
              }}
            />
          </svg>
          
          <style>{`
            @keyframes ecgGlow {
              0% { stroke-dashoffset: 600; }
              100% { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* Floating glass statistics cards */}
          <div className="absolute -top-6 left-2 bg-white/[0.03] backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-bounce [animation-duration:6s] max-w-[200px]">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">HIPAA Security</div>
              <div className="text-xs font-black text-slate-200 mt-0.5">Fully Validated</div>
            </div>
          </div>

          <div className="absolute -bottom-8 right-2 bg-white/[0.03] backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-bounce [animation-duration:8s] max-w-[220px]">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sync Integrity</div>
              <div className="text-xs font-black text-slate-200 mt-0.5">99.99% Live SLA</div>
            </div>
          </div>

        </div>

        {/* Footer info links */}
        <div className="flex items-center justify-between text-[9px] text-slate-500 font-extrabold uppercase tracking-widest relative z-10 border-t border-white/5 pt-6">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500/70" />
            Patient-First Coordination
          </span>
          <span>v1.8.0</span>
        </div>

      </div>

      {/* RIGHT SIDE: Centered login card (55%) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 relative z-10">
        
        {/* Top return link */}
        <div className="absolute top-8 left-8 sm:left-12">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all bg-white/[0.02] border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Return to Public Website</span>
          </Link>
        </div>

        {/* Center login box */}
        <div className="max-w-[440px] w-full bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col gap-8 relative">
          
          {/* Gradient card border highlight */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>

          {/* Heading Logo & titles */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center h-14 w-auto max-w-[180px] shadow-inner">
              <img src={logoSrc} alt="Nest Cares" className="h-8 w-auto object-contain" />
            </div>
            <div className="mt-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Console Command</h2>
              <p className="text-slate-400 text-[10px] tracking-widest uppercase font-bold mt-1">Supervised Healthcare Administration</p>
            </div>
          </div>

          {/* Mode toggle selector tabs */}
          <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 relative z-10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setError('');
              }}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                loginType === 'admin' 
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-md shadow-teal-500/5' 
                  : 'text-slate-500 hover:text-slate-300'
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
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                loginType === 'doctor' 
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-md shadow-teal-500/5' 
                  : 'text-slate-555 hover:text-slate-305'
              }`}
            >
              Clinician Portal
            </button>
          </div>

          {/* Error Message banner */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-350 text-xs p-4 rounded-2xl text-left leading-relaxed font-bold flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form input section */}
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            {loginType === 'admin' ? (
              /* Email Input */
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>Administrative Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nestcares.in"
                  className="w-full px-4 py-3.5 bg-slate-950/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-800 text-xs font-semibold shadow-inner"
                />
              </div>
            ) : (
              /* Doctor ID Input */
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                  <span>Clinician Badge ID</span>
                </label>
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC-101"
                  className="w-full px-4 py-3.5 bg-slate-950/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-800 text-xs font-semibold shadow-inner"
                />
              </div>
            )}

            {/* Password Input */}
            <div className="flex flex-col gap-2 relative group">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Secret Passcode</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-950/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-slate-950/80 transition-all text-white placeholder-slate-800 text-xs font-semibold shadow-inner"
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

            {/* Options Row (Remember Me & Forgot Pass) */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/5 bg-slate-950/50 text-teal-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Remember Session</span>
              </label>
              <button 
                type="button"
                onClick={() => alert('Please contact administrative coordinator to reset login passkey.')}
                className="hover:text-white transition-colors"
              >
                Reset Access?
              </button>
            </div>

            {/* Large Gradient Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 hover:from-teal-400 hover:via-teal-500 hover:to-blue-500 disabled:from-slate-850 disabled:to-slate-850 disabled:text-slate-500 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs shadow-lg shadow-teal-500/10 border border-white/5 cursor-pointer mt-8"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Log In to Command</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Compliance & Trust Badges footer */}
          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 text-center select-none">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.01]">
              <span className="text-[9px] font-black text-slate-400 leading-none">HIPAA</span>
              <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Compliant</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.01]">
              <span className="text-[9px] font-black text-slate-400 leading-none">SSL</span>
              <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-0.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                Secure
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.01]">
              <span className="text-[9px] font-black text-slate-400 leading-none">AES-256</span>
              <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">Encrypted</span>
            </div>
          </div>

        </div>

        {/* Live system state text indicator below card */}
        <div className="mt-8 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500 select-none">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Nest Cares Node-04 Online</span>
        </div>

      </div>

    </div>
  );
};

export default Login;
