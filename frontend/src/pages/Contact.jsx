import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, ShieldAlert, 
  MessageSquare, Send, CheckCircle2, ArrowRight
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import PageLayout from '../components/common/PageLayout';
import { useToast } from '../components/common/ToastContext';

const Contact = ({ contactSettings }) => {
  const { addToast } = useToast();

  useEffect(() => {
    document.title = "Contact Us - Home Healthcare Services";
  }, []);

  const phoneNumbers = contactSettings?.phoneNumbers || ['+91 92488 49388', '+91 63035 91409'];
  const email = contactSettings?.emailAddress || 'contact@carehome.com';
  const whatsapp = contactSettings?.whatsappNumber || '+91 92488 49388';
  const address = contactSettings?.officeAddress || 'Chandra Shekar Colony, Nizamabad, Telangana - 503002';
  const workingHours = contactSettings?.workingHours || 'Mon - Sun: 24/7 Available for Emergencies';
  const emergency = contactSettings?.emergencyContact || '+91 63035 91409';
  const mapLink = contactSettings?.googleMapsLink || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60320.09117621495!2d78.06456073100346!3d18.672462371908477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcddb435ff51ca1%3A0x67dbb8a0717e1329!2sNizamabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin';

  const cleanPhone = String(phoneNumbers[0] || '').replace(/[^+\d]/g, '');
  const cleanWhatsapp = String(whatsapp || '').replace(/[^+\d]/g, '');
  const cleanEmergency = String(emergency || '').replace(/[^+\d]/g, '');

  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim() || !form.message.trim()) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    
    setLoading(true);
    // Simulate contact submission
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      addToast('Inquiry message sent successfully!', 'success');
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <PageLayout
      title="Contact Support Desk"
      description="Get in touch with clinical advisors, coordinate patient discharge, or consult on ICU setup availability."
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact' }]}
    >
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        
        {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <Card className="space-y-6">
            
            {/* Corporate Office */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-xl shrink-0 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-955 uppercase tracking-wide">Corporate Office</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{address}</p>
              </div>
            </div>

            {/* Telephone Contacts */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-xl shrink-0 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-955 uppercase tracking-wide">Telephone Hotline</h4>
                <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-slate-500 font-semibold">
                  {phoneNumbers.map((ph, idx) => (
                    <a key={idx} href={`tel:${ph.replace(/[^+\d]/g, '')}`} className="hover:text-teal-800 hover:underline w-fit">
                      {ph}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Queries */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-teal-50 text-teal-800 rounded-xl shrink-0 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-955 uppercase tracking-wide">Email Queries</h4>
                <a href={`mailto:${email}`} className="text-xs sm:text-sm text-slate-505 font-semibold hover:text-teal-800 hover:underline block">
                  {email}
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-slate-50 text-slate-650 rounded-xl shrink-0 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Operating Hours</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{workingHours}</p>
              </div>
            </div>

          </Card>

          {/* Emergency Alert Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-455">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider">Emergency Dispatch Desk</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              For rapid ambulance response, ventilator ICU installations, or immediate practitioner assignment:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a 
                href={`tel:${cleanEmergency}`} 
                className="w-full sm:w-auto px-5 py-2.5 bg-red-650 hover:bg-red-750 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider text-center"
              >
                Call Support: {emergency}
              </a>
              <a 
                href={`https://wa.me/${cleanWhatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider text-center"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT INQUIRY FORM */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-955 mb-1.5 font-serif-editorial">Send an Inquiry</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-semibold">
              Have questions regarding charges, package details, or nursing shifts? Drop us a note below and our coordinator will write back within 12 hours.
            </p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/40 border border-emerald-200/50 p-6 rounded-2xl flex flex-col items-center gap-4 text-center"
                >
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-805 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Message Received!</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                      Our coordinator has received your coordinates and will email/call you back shortly.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setSent(false)} className="mt-2">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    
                    <Input
                      label="Mobile Number"
                      placeholder="10-digit number"
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    placeholder="patient@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />

                  <Input
                    label="Subject"
                    placeholder="e.g. ICU Bed setup quote"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />

                  <div className="flex flex-col gap-1.5 text-left font-sans">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Type details of required support..."
                      rows="4"
                      className="w-full bg-white text-slate-800 text-sm border border-slate-200 rounded-xl px-4 py-2.5 placeholder-slate-400 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 transition-all font-semibold resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="w-full mt-2"
                  >
                    <span>Submit details</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </Card>
        </div>

      </div>

      {/* 3. GOOGLE MAPS EMBED */}
      <Card className="!p-1.5 h-80 overflow-hidden shadow-sm mb-6">
        <iframe
          src={mapLink}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Corporate Office Map Location"
          className="rounded-[14px] grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </Card>

    </PageLayout>
  );
};

export default Contact;
