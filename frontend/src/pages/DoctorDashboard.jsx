import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../utils/mockDb';
import { 
  Heart, User, Calendar, MapPin, Phone, FileText, Activity, 
  LogOut, Shield, ChevronRight, CheckCircle2, AlertCircle, Save 
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [advisoryNote, setAdvisoryNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Change Password States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleInitiatePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      const doctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
      const idx = doctors.findIndex(d => d && d.doctorId === doctor.doctorId);
      
      if (idx === -1) {
        showToast('Doctor profile not found.', 'error');
        return;
      }

      if (doctors[idx].password !== passwordForm.currentPassword) {
        showToast('Current password is incorrect.', 'error');
        return;
      }

      // Generate verification code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      // Trigger backend mail dispatch to nestcares.in@gmail.com
      try {
        await axios.post('http://localhost:5000/api/auth/doctor-otp', {
          doctorId: doctor.doctorId,
          doctorName: doctor.name,
          otpCode: otp
        });
        showToast('Verification OTP sent to administrator email!');
      } catch (mailErr) {
        console.warn('Mail server unreachable, fallback logging verification code:', otp);
        showToast('OTP code generated successfully.');
      }

      setShowOtpVerify(true);
    } catch (err) {
      showToast('Failed to initialize verification.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleVerifyOtpAndChangePassword = async (e) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp) {
      showToast('Invalid verification OTP code!', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      const doctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
      const idx = doctors.findIndex(d => d && d.doctorId === doctor.doctorId);
      
      if (idx === -1) {
        showToast('Doctor profile not found.', 'error');
        return;
      }

      doctors[idx].password = passwordForm.newPassword;
      localStorage.setItem('mock_doctors', JSON.stringify(doctors));
      
      const updatedDoc = { ...doctor, password: passwordForm.newPassword };
      localStorage.setItem('doctor_user', JSON.stringify(updatedDoc));
      setDoctor(updatedDoc);

      showToast('Password changed successfully!');
      setShowPasswordModal(false);
      setShowOtpVerify(false);
      setGeneratedOtp('');
      setEnteredOtp('');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast('Failed to save new password.', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    // Check doctor auth session
    const docUserStr = localStorage.getItem('doctor_user');
    const docToken = localStorage.getItem('doctor_token');
    
    if (!docToken || !docUserStr) {
      localStorage.removeItem('doctor_token');
      localStorage.removeItem('doctor_user');
      navigate('/login');
      return;
    }

    try {
      const docUser = JSON.parse(docUserStr);
      setDoctor(docUser);
      fetchAssignments(docUser.doctorId);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchAssignments = async (docId) => {
    try {
      setLoading(true);
      // Fetch bookings, filter where assignedDoctor matches this doctorId
      let list = [];
      try {
        const res = await axios.get('/bookings');
        list = res.data.success ? res.data.data : mockDb.getBookings();
      } catch (err) {
        list = mockDb.getBookings();
      }
      
      // Filter bookings where assignedDoctor equals current doctorId
      const assigned = list.filter(b => b.assignedDoctor === docId);
      setAssignments(assigned);
    } catch (err) {
      console.error('Error fetching clinical assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_user');
    navigate('/login');
  };

  const handleSaveAdvisory = async () => {
    if (!selectedPatient) return;
    try {
      setSavingNote(true);
      
      // Save doctor advisory note to booking database
      const updatedNotes = advisoryNote.trim();
      const updatedBooking = { ...selectedPatient, doctorNotes: updatedNotes };

      try {
        // Try backend put
        await axios.put(`/bookings/${selectedPatient._id}/status`, { 
          status: selectedPatient.status,
          doctorNotes: updatedNotes 
        });
      } catch (err) {
        // Fallback to local storage mockDb
        const mockBookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
        const idx = mockBookings.findIndex(b => b._id === selectedPatient._id);
        if (idx !== -1) {
          mockBookings[idx].doctorNotes = updatedNotes;
          localStorage.setItem('mock_bookings', JSON.stringify(mockBookings));
        }
      }

      showToast('Clinical advisory note logged successfully!');
      setSelectedPatient(updatedBooking);
      fetchAssignments(doctor.doctorId);
    } catch (err) {
      showToast('Failed to save advisory note.', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-350 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-teal-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">Synchronizing Clinical Queue...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-350 font-sans flex flex-col relative select-none animate-fadeIn">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-55 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border transition-all text-xs font-bold ${
          toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. CLINICAL HEADER */}
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-teal-500/30 bg-slate-800 flex items-center justify-center">
            {doctor?.img ? (
              <img 
                src={doctor.img} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-teal-400" />
            )}
          </div>
          <div className="text-left leading-none">
            <h1 className="text-sm font-black text-white tracking-wide uppercase">{doctor?.name || 'Doctor'}</h1>
            <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest mt-1 block">
              {doctor?.designation || 'Clinical consultant'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors">
            Public Portal
          </Link>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/30 border border-rose-800/20 hover:bg-rose-900 text-rose-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Assigned Patient Grid Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-white tracking-widest">Active Bedside Assignments</h2>
            <span className="bg-teal-900/40 text-teal-300 border border-teal-800/50 text-[9px] font-black px-2 py-0.5 rounded-full">
              {assignments.length} Patients
            </span>
          </div>

          {assignments.length === 0 ? (
            <Card className="bg-slate-900/20 border-slate-800/60 p-8 text-center flex flex-col items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-slate-605" />
              <p className="text-slate-500 text-xs font-semibold">No active patient bookings coordinates assigned to your Doctor ID yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignments.map(b => {
                const isSelected = selectedPatient?._id === b._id;
                return (
                  <div
                    key={b._id}
                    onClick={() => {
                      setSelectedPatient(b);
                      setAdvisoryNote(b.doctorNotes || '');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-teal-950/20 border-teal-500 shadow-md shadow-teal-500/5' 
                        : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[8px] bg-slate-800 text-slate-400 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                          ID: {b.bookingId}
                        </span>
                        <h3 className="text-xs font-black text-white uppercase mt-2 tracking-wide">{b.name}</h3>
                        <p className="text-[10px] text-teal-400 font-bold uppercase mt-1 leading-none">{b.serviceName} ({b.subServiceName})</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          b.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          b.status === 'approved' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {b.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Clinical Advisory Panel */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Patient Core Card info */}
              <div className="bg-slate-900/40 border border-slate-855 rounded-2xl p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-left">
                    <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">Active Coordinate Case</span>
                    <h2 className="text-sm font-black text-white uppercase tracking-wide mt-1">{selectedPatient.name}</h2>
                  </div>
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
                    {selectedPatient.bookingId}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Contact Number</div>
                      <div className="text-slate-300 font-bold mt-1">{selectedPatient.mobile}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Home Address</div>
                      <div className="text-slate-300 font-semibold mt-1">{selectedPatient.address}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Calendar className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Slot & Coordination</div>
                      <div className="text-slate-300 font-semibold mt-1">
                        {selectedPatient.preferredDate} ({selectedPatient.preferredTime})
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Activity className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Clinical Category</div>
                      <div className="text-teal-450 font-black mt-1 uppercase tracking-wider">{selectedPatient.serviceName}</div>
                    </div>
                  </div>
                </div>

                {selectedPatient.notes && (
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 text-left">
                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Patient Triage Notes</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold leading-relaxed">
                      {selectedPatient.notes}
                    </p>
                  </div>
                )}

              </div>

              {/* Advisory Logs panel */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-teal-405" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Clinical Advisory & Vitals Log</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Physician Prescription / Vital check logs
                  </label>
                  <textarea
                    value={advisoryNote}
                    onChange={(e) => setAdvisoryNote(e.target.value)}
                    placeholder="e.g. Vitals monitored: SpO2 97%, Pulse 84 bpm. Recommend keeping oxygen concentrator flow at 3L/min. Continue general bedside nursing schedule..."
                    rows="6"
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:bg-slate-950 transition-all text-slate-200 placeholder-slate-600 resize-none leading-relaxed font-semibold"
                  />
                </div>

                <button
                  onClick={handleSaveAdvisory}
                  disabled={savingNote}
                  className="w-full bg-teal-850 hover:bg-teal-900 text-teal-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-teal-950/50 border border-teal-700/50 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingNote ? 'Logging Advisory...' : 'Save & Log Advisory'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/20 border border-slate-850/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 h-[350px]">
              <div className="w-12 h-12 bg-slate-900/60 border border-slate-800 rounded-full flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Patient</h3>
                <p className="text-slate-500 text-[10px] font-semibold leading-relaxed">
                  Choose a patient from your active bedside assignments queue on the left to write clinical checks, check details, or write prescription logs.
                </p>
              </div>
            </div>
          )}
        </div>

      {/* 3. CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-left shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Change Portal Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setShowOtpVerify(false);
                  setEnteredOtp('');
                  setGeneratedOtp('');
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {!showOtpVerify ? (
              <form onSubmit={handleInitiatePasswordChange} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-slate-700 text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-slate-700 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full bg-teal-850 hover:bg-teal-900 text-teal-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 border border-teal-700/50 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{updatingPassword ? 'Verifying...' : 'Request OTP Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-4">
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl text-[10px] text-slate-450 leading-relaxed font-semibold">
                  ⚠️ A 6-digit confirmation code has been sent to the administrator email **nestcares.in@gmail.com**. Please obtain this code from the admin to authorize your password change.
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enter Verification OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all text-white placeholder-slate-700 text-center tracking-[0.5em] text-sm font-bold animate-pulse"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpVerify(false);
                      setEnteredOtp('');
                    }}
                    className="w-1/3 bg-slate-900 hover:bg-slate-850 text-slate-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-850 cursor-pointer text-center text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-2/3 bg-teal-850 hover:bg-teal-900 text-teal-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 border border-teal-700/50 cursor-pointer shadow-lg disabled:opacity-50 text-xs"
                  >
                    <span>{updatingPassword ? 'Submitting...' : 'Confirm & Save'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      </div>

    </div>
  );
};

export default DoctorDashboard;
