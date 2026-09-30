import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../utils/mockDb';
import { apiClient, bookingsAPI } from '../services/api';
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
        await apiClient.post('/auth/doctor-otp', {
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
        const res = await apiClient.get('/bookings');
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
        await apiClient.put(`/bookings/${selectedPatient._id}/status`, { 
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
      <div className="min-h-screen bg-[#fafafb] text-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-slate-900 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Synchronizing Clinical Queue...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-900 font-sans flex flex-col relative select-none">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border transition-all text-xs font-bold ${
          toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. CLINICAL HEADER */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-xs">
            {doctor?.img ? (
              <img 
                src={doctor.img} 
                alt={doctor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-slate-600" />
            )}
          </div>
          <div className="text-left leading-none">
            <h1 className="text-sm font-black text-slate-950 tracking-tight uppercase">{doctor?.name || 'Doctor'}</h1>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">
              {doctor?.designation || doctor?.specialty || 'Clinical Consultant'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="text-xs font-bold text-slate-600 hover:text-slate-950 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
            Public Site
          </Link>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold transition-all cursor-pointer border border-slate-200"
          >
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>Change Password</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Assigned Patient Grid Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider">Active Bedside Assignments</h2>
            <span className="bg-slate-950 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {assignments.length} Patients
            </span>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
              <Heart className="w-8 h-8 text-slate-400" />
              <p className="text-slate-500 text-xs font-semibold">No active patient bookings assigned to your Doctor ID yet.</p>
            </div>
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-slate-950 text-white border-slate-950 shadow-md' 
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          ID: {b.bookingId}
                        </span>
                        <h3 className={`text-sm font-black uppercase mt-2 tracking-tight ${isSelected ? 'text-white' : 'text-slate-950'}`}>{b.name}</h3>
                        <p className={`text-[11px] font-bold uppercase mt-1 leading-none ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{b.serviceName} ({b.subServiceName})</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          b.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {b.status}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'} group-hover:translate-x-0.5 transition-transform`} />
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
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-xs">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Active Patient Record</span>
                    <h2 className="text-base font-black text-slate-950 uppercase tracking-tight mt-0.5">{selectedPatient.name}</h2>
                  </div>
                  <span className="text-xs font-black bg-slate-100 text-slate-900 px-3 py-1 rounded-full border border-slate-200">
                    {selectedPatient.bookingId}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Contact Number</div>
                      <div className="text-slate-900 font-bold mt-1">{selectedPatient.mobile}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Home Address</div>
                      <div className="text-slate-700 font-semibold mt-1">{selectedPatient.address}</div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Date & Slot</div>
                      <div className="text-slate-700 font-semibold mt-1">
                        {selectedPatient.preferredDate} ({selectedPatient.preferredTime})
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Activity className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Clinical Category</div>
                      <div className="text-slate-900 font-bold mt-1 uppercase">{selectedPatient.serviceName}</div>
                    </div>
                  </div>
                </div>
                {selectedPatient.notes && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Patient Triage Notes</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2 font-medium leading-relaxed">
                      {selectedPatient.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Advisory Logs panel */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 text-left shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Clinical Advisory & Vitals Log</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Physician Prescription / Vital Check Logs
                  </label>
                  <textarea
                    value={advisoryNote}
                    onChange={(e) => setAdvisoryNote(e.target.value)}
                    placeholder="e.g. Vitals monitored: SpO2 97%, Pulse 84 bpm. Recommend keeping oxygen concentrator flow at 3L/min. Continue general bedside nursing schedule..."
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 resize-none leading-relaxed font-medium"
                  />
                </div>

                <button
                  onClick={handleSaveAdvisory}
                  disabled={savingNote}
                  className="w-full bg-slate-950 hover:bg-black text-white py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingNote ? 'Logging Advisory...' : 'Save & Log Advisory'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 h-[350px] shadow-xs">
              <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600">
                <User className="w-6 h-6" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Select Patient</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Choose a patient from your active bedside assignments queue on the left to write clinical checks, check details, or write prescription logs.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-left shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">Change Portal Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setShowOtpVerify(false);
                  setEnteredOtp('');
                  setGeneratedOtp('');
                }}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1"
              >
                ✕
              </button>
            </div>

            {!showOtpVerify ? (
              <form onSubmit={handleInitiatePasswordChange} className="space-y-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400 text-xs font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400 text-xs font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400 text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full bg-slate-950 hover:bg-black text-white py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm disabled:opacity-50 mt-2"
                >
                  <span>{updatingPassword ? 'Verifying...' : 'Request OTP Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpAndChangePassword} className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-medium">
                  ⚠️ A 6-digit confirmation code has been sent to the administrator email **nestcares.in@gmail.com**. Please obtain this code from the admin to authorize your password change.
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Enter Verification OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400 text-center tracking-[0.4em] text-sm font-bold"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpVerify(false);
                      setEnteredOtp('');
                    }}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-2/3 bg-slate-950 hover:bg-black text-white py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm disabled:opacity-50"
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
  );
};

export default DoctorDashboard;
