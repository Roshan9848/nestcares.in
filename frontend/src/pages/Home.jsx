import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import * as Icons from 'lucide-react';
import { 
  ArrowRight, Phone, MessageSquare, ShieldCheck, Clock, Award, Users, 
  ChevronRight, Calendar, UserPlus, CheckCircle, ChevronDown, Activity,
  Sliders, Layout, HelpCircle, HardDrive, Compass, Info, CheckCircle2
} from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.Heart;
  return <IconComponent className={className} />;
};

import { translations } from '../utils/translations';

const Home = ({ homepageSettings, contactSettings, services, testimonials, faqs }) => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [currentLang, setCurrentLang] = useState(localStorage.getItem('preferred_language') || 'english');

  useEffect(() => {
    const syncLang = () => {
      setCurrentLang(localStorage.getItem('preferred_language') || 'english');
    };
    window.addEventListener('languageChanged', syncLang);
    return () => window.removeEventListener('languageChanged', syncLang);
  }, []);

  const isTe = currentLang === 'telugu';
  const t = (key, fallback) => translations[isTe ? 'TE' : 'EN'][key] || fallback;

  const heroHeading = isTe ? t('hero_title') : (homepageSettings?.heroHeading || t('hero_title'));
  const heroDescription = isTe ? t('hero_desc') : (homepageSettings?.heroDescription || t('hero_desc'));
  const ctaText = isTe ? t('cta_primary') : (homepageSettings?.ctaText || t('cta_primary'));

  const whyChooseUs = isTe ? [
    { title: 'అనుభవజ్ఞులైన వైద్యులు', desc: 'అత్యవసర మరియు ఇంటెన్సివ్ కేర్ నేపథ్యం ఉన్న లైసెన్స్ పొందిన నిపుణులే సేవలు అందిస్తారు.' },
    { title: 'ఆసుపత్రి తరహా పరికరాలు', desc: 'మేము మీ ఇంట్లోనే వెంటిలేటర్లు, మానిటర్లు మరియు ప్రత్యేక బెడ్లను ఇన్‌స్టాల్ చేస్తాము.' },
    { title: '24/7 త్వరిత స్పందన', desc: 'అంబులెన్స్ సేవలు మరియు సహాయక డెస్క్ 24 గంటలూ అందుబాటులో ఉంటాయి.' },
    { title: 'సరసమైన ధరలు', desc: 'ఆసుపత్రి ఐసీయూ ఛార్జీలతో పోలిస్తే 60% వరకు ఖర్చు ఆదా చేసుకోండి.' }
  ] : (homepageSettings?.whyChooseUs || [
    { title: 'Experienced Clinicians', desc: 'All care is delivered by licensed medical professionals with intensive hospital backgrounds.' },
    { title: 'Hospital-Grade Equipment', desc: 'We install high-quality ventilators, monitors, and specialized medical beds directly at home.' },
    { title: '24/7 Quick Response', desc: 'Dedicated round-the-clock ambulance dispatch and medical helpline at your disposal.' },
    { title: 'Affordable Recovery', desc: 'Save up to 60% compared to extended hospital ICU or clinical boarding charges.' }
  ]);

  const howItWorks = isTe ? [
    { step: '1', title: 'సేవను ఎంచుకోండి', desc: 'మా సాధారణ ఫారమ్ నింపండి లేదా కాల్/వాట్సాప్ ద్వారా మీ అవసరాలను మాకు తెలియజేయండి.' },
    { step: '2', title: 'వైద్య మూల్యాంకనం', desc: 'మా కోఆర్డినేటర్ వైద్యులతో చర్చించి ఒక సమగ్ర చికిత్స ప్రణాళికను సిద్ధం చేస్తారు.' },
    { step: '3', title: 'నిపుణుల నియోగం', desc: 'మేము వైద్య పరికరాలను సరఫరా చేసి, నిపుణులైన నర్సులను మీ ఇంటి వద్ద ఏర్పాటు చేస్తాము.' },
    { step: '4', title: 'నిరంతర పర్యవేక్షణ', desc: 'చికిత్స పర్యవేక్షణ, రెగ్యులర్ డాక్టర్ చెకప్‌లు మరియు అత్యవసర బ్యాకప్ అందుబాటులో ఉంటాయి.' }
  ] : (homepageSettings?.howItWorks || [
    { step: '1', title: 'Request Service', desc: 'Fill out our simple form or contact us via call/WhatsApp to describe your clinical needs.' },
    { step: '2', title: 'Medical Assessment', desc: 'Our head coordinator reviews and aligns with doctors to design a custom care plan.' },
    { step: '3', title: 'Expert Deployment', desc: 'We deliver medical machinery, dispatch professionals, and coordinate immediate setup.' },
    { step: '4', title: 'Continuous Monitoring', desc: 'Get ongoing clinical audits, physician visits, and emergency support backup.' }
  ]);

  // Safe array fallbacks to prevent TypeError if data is null/undefined during API loading
  const servicesList = Array.isArray(services) ? services : [];
  const testimonialsList = Array.isArray(testimonials) ? testimonials : [];
  const faqsList = Array.isArray(faqs) ? faqs : [];

  const filteredServices = servicesList
    .filter(s => s && s.active)
    .filter(s => {
      if (activeCategory === 'All') return true;
      const title = s.title.toLowerCase();
      const slug = s.slug.toLowerCase();
      if (activeCategory === 'Critical Care') return slug.includes('icu') || title.includes('icu') || title.includes('critical');
      if (activeCategory === 'Physiotherapy') return slug.includes('physio') || title.includes('physio') || title.includes('rehab');
      if (activeCategory === 'Home Nursing') return slug.includes('nurse') || title.includes('nursing') || title.includes('caregiver');
      if (activeCategory === 'Diagnostics') return slug.includes('test') || title.includes('diagnostic') || title.includes('lab');
      return true;
    })
    .filter(s => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) || 
        s.shortDescription.toLowerCase().includes(q)
      );
    });

  const phone = contactSettings?.phoneNumbers?.[0] || '+91 98765 43210';
  const whatsapp = contactSettings?.whatsappNumber || '+91 98765 43210';
  const cleanPhone = String(phone || '').replace(/[^+\d]/g, '');
  const cleanWhatsapp = String(whatsapp || '').replace(/[^+\d]/g, '');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const whyIcons = [
    <Award className="w-5 h-5 text-teal-850" />,
    <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    <Clock className="w-5 h-5 text-teal-650" />,
    <Users className="w-5 h-5 text-indigo-700" />
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#fdfcfb] min-h-screen text-slate-700 font-sans-editorial"
    >
      
      {/* 1. HERO SECTION (EDITORIAL ASYMMETRICAL LAYOUT) */}
      <section className="relative min-h-[85vh] flex items-center py-12 lg:py-16 overflow-hidden bg-warm-ambient">
        {/* Animated Ambient background blobs */}
        <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-teal-500/5 blur-[100px] pointer-events-none animate-pulse duration-[6000ms]"></div>
        <div className="absolute bottom-12 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Typography Block */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-fit self-center lg:self-start flex flex-wrap gap-2 justify-center lg:justify-start"
              >
                <Badge variant="teal" pulse={true}>
                  📍 Serving Exclusively in Nizamabad
                </Badge>
                <Badge variant="orange">
                  Now Active
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-bold text-slate-900 leading-[1.1] tracking-tight"
              >
                Hospital-Grade Care.
                <span className="text-teal-805 italic block mt-1 font-normal font-serif-editorial">
                  At Home in Nizamabad.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-semibold"
              >
                Avoid stressful commutes to Hyderabad or waiting lists. We arrange state-of-the-art ICU setups, registered nurse shifts, and physician visits directly to your bedside—available exclusively in Nizamabad.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate('/services')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Medical Catalog
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => window.location.href = `tel:${cleanPhone}`}
                  icon={<Phone className="w-4 h-4 text-slate-500" />}
                >
                  Emergency Coordinates
                </Button>
              </motion.div>

              {/* Trust coordinate list */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 text-[10px] text-slate-450 uppercase font-extrabold tracking-wider border-t border-slate-100 pt-5 mt-2"
              >
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-800" /> ICU Grade Equipment</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-800" /> Certified Care Nurses</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-800" /> Nizamabad Only Coverage</span>
              </motion.div>
            </div>

            {/* Right Column: Layered Bento Collage (Light theme, welcoming & elegant) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] lg:min-h-[450px]"
            >
              {/* Organic background shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-teal-500/10 to-amber-500/5 rounded-full blur-[80px] -z-10 animate-pulse duration-[8000ms]"></div>
              
              <div className="relative w-full max-w-[400px] h-[340px] md:h-[380px] z-10">
                
                {/* 1. Main Base Card - Premium lifestyle/clinical photo with shadow */}
                <div className="absolute inset-0 bg-white p-3 rounded-[32px] border border-slate-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600" 
                      alt="Professional medical clinician consulting patient" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* 2. Floating Card 1: Live Dispatch Status (Top-Right) */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute -top-6 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-150 shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex items-center gap-3 z-20 text-left"
                >
                  <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">{isTe ? "సమన్వయం" : "Coordination"}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">{isTe ? "15-నిమిషాల స్పందన" : "15-Min Response"}</span>
                    <span className="text-[9px] text-teal-700 font-semibold block mt-0.5">{isTe ? "యాక్టివ్ డాక్టర్ డిస్పాచ్" : "Active Doctor Dispatch"}</span>
                  </div>
                </motion.div>

                {/* 3. Floating Card 2: Specialized Nurses (Bottom-Left) */}
                <motion.div 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-150 shadow-[0_15px_35px_rgba(0,0,0,0.06)] flex items-center gap-3.5 z-20 text-left"
                >
                  <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">{isTe ? "ధృవీకరించబడిన నాణ్యత" : "Vetted Quality"}</span>
                    <span className="text-xs font-extrabold text-slate-900 block mt-0.5">{isTe ? "ఐసీయూ గ్రేడ్ ప్రమాణం" : "ICU Grade Standard"}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-[9px] text-slate-500 font-bold">{isTe ? "100% నేపథ్య ధృవీకరణ" : "100% Background Verified"}</span>
                    </div>
                  </div>
                </motion.div>

                {/* 4. Floating Badge: Verified seal (Bottom-Right, overlapping card border) */}
                <div className="absolute bottom-6 -right-6 bg-slate-900 text-white px-3.5 py-1.5 rounded-full border border-slate-800 shadow-md text-[9px] font-bold uppercase tracking-wider z-20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isTe ? "క్లినికల్ ఎక్సలెన్స్" : "Clinical Excellence"}</span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES (CLEAN EDITORIAL CARDS) */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col gap-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">Medical Catalog</span>
            <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-slate-900">Hospital Services at Bedside</h2>
            <p className="text-slate-500 text-xs max-w-xl mx-auto leading-relaxed">
              We coordinate and deliver complex ICU setups, physician consults, registered nurses, and diagnostics tests straight to your bedroom.
            </p>
          </div>

          {/* Live Search & Category Filter Console */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-sm no-print">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 justify-start w-full md:w-auto">
              {['All', 'Critical Care', 'Home Nursing', 'Physiotherapy', 'Diagnostics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-teal-850 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-650 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar Input */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white text-slate-800 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-700 focus:border-teal-700 placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => {
                const img = service.galleryImages?.[0] || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400';
                const resolvedImg = img.startsWith('/') ? `http://localhost:5000${img}` : img;
                
                return (
                  <motion.div 
                    key={service._id} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="card-premium flex flex-col h-full overflow-hidden group text-left"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={resolvedImg} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                      
                      {/* Index header */}
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 py-1 px-2 rounded-lg text-slate-500 text-[10px] font-bold">
                        0{index + 1}
                      </div>

                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg text-teal-850 border border-slate-200 flex items-center justify-center">
                        <DynamicIcon name={service.icon} className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col grow justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-teal-800 transition-colors">{service.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{service.shortDescription}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between gap-2">
                        <Link 
                          to={`/services/${service.slug}`} 
                          className="text-[10px] font-bold uppercase tracking-wider text-teal-800 hover:text-teal-950 transition-colors inline-flex items-center gap-1 py-1.5"
                        >
                          <span>Explore Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to="/book"
                          state={{ selectService: service.title }}
                          className="bg-teal-800 hover:bg-teal-900 text-white text-[10px] font-extrabold uppercase py-1.5 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow active:scale-98"
                        >
                          Book Care
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-405 font-semibold text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No matching clinical specialities found.
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/services" 
              className="btn-secondary inline-flex px-6 py-2.5 rounded-xl text-slate-800 hover:text-teal-800"
            >
              <span>View All Specialities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SIMPLIFIED PROCESS PATH (MINIMALIST 4-STEP GRID) */}
      <section className="py-12 bg-slate-50/40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">How It Works</span>
            <h3 className="text-2xl font-serif-editorial font-bold text-slate-900 leading-tight">Simple Setup Sequence</h3>
            <p className="text-slate-500 text-xs font-semibold">Getting started with premium home care takes four simple coordinates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col text-left justify-between h-full bg-white relative p-5 hover:shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 bg-teal-50 border border-teal-200/50 text-teal-800 text-[11px] font-bold rounded-xl flex items-center justify-center shadow-sm">
                    0{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold mt-1.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT BANNER CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-900 to-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col gap-4">
          <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold tracking-tight text-white">Ready to Set Up Your Specialized Home Care?</h3>
          <p className="text-slate-200 text-xs max-w-xl mx-auto leading-relaxed font-semibold">
            Contact us today to receive a customized patient recovery plan. We arrange medical equipment delivery, nurse schedules, and physician visits within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full">
            <button 
              onClick={() => navigate('/services')}
              className="w-full sm:w-auto px-6 py-3 bg-teal-400 hover:bg-teal-350 text-slate-955 text-xs font-extrabold rounded-xl text-center transition-all duration-300 shadow-[0_4px_15px_rgba(45,212,191,0.25)] hover:shadow-[0_6px_20px_rgba(45,212,191,0.35)] active:scale-98 cursor-pointer"
            >
              Explore Services
            </button>
            <a 
              href={`https://wa.me/${cleanWhatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 hover:bg-slate-50 text-xs font-extrabold rounded-xl text-center transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
