import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Award, HeartHandshake, CheckCircle2, Star, Users, ShieldAlert, BadgeCheck, Network, ClipboardCheck, ShieldCheck } from 'lucide-react';

import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { SectionHeading } from '../components/common/Typography';
import PageLayout from '../components/common/PageLayout';
import { translations } from '../utils/translations';

const About = ({ doctors, founders }) => {
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
  useEffect(() => {
    document.title = "About Us - Premium Home Healthcare Services";
  }, []);

  const displayFounders = founders && founders.length > 0 ? founders : [
    {
      name: 'Dr. Anand Verma',
      role: 'Founder & Chief Medical Director',
      experience: '22+ Years Experience',
      bio: 'Our mission is to bring high-acuity critical care directly to patient bedrooms in Nizamabad, ensuring families recover together.',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Dr. Priya Naidu',
      role: 'Co-founder & Chief Clinical Strategist',
      experience: '15+ Years Experience',
      bio: 'By establishing professional home nursing standards, we guarantee safety and clinical reliability for every recovery.',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    }
  ];

  const displayDoctors = doctors && doctors.length > 0 ? doctors.filter(d => d.active) : [
    {
      _id: 'doc_1',
      name: 'Dr. Anand Verma',
      designation: 'Chief Consultant Cardiologist & Medical Director',
      experience: '22 Years Experience',
      bio: 'Founder & Chief Medical Director overseeing home clinical procedures, emergency triage audits, and bedside telemetry systems.',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      speciality: 'Cardiology & ICU Care'
    },
    {
      _id: 'doc_2',
      name: 'Dr. Priya Naidu',
      designation: 'Senior Consultant Pediatrist & Geriatrics Specialist',
      experience: '15 Years Experience',
      bio: 'Co-founder & Chief Clinical Strategist managing home pediatric setups, elderly recovery guidelines, and bedside nursing standards.',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
      speciality: 'Geriatrics & Pediatrics'
    },
    {
      _id: 'doc_3',
      name: 'Dr. K. Srinivas',
      designation: 'Consultant Pulmonologist & Critical Care Advisor',
      experience: '18 Years Experience',
      bio: 'Consulting Pulmonologist specialized in home respirator calibrations, BiPAP/CPAP settings audits, and clinical oxygen management.',
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
      speciality: 'Pulmonology & ICU Care'
    }
  ];

  const coreValues = isTe ? [
    { title: 'రోగి-మొదటి ప్రాధాన్యత', desc: 'ప్రతి వైద్య నిర్ణయం మరియు కేర్ షెడ్యూల్ రోగి కోలుకునే సౌకర్యానికి అనుగుణంగా రూపొందించబడుతుంది.', icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { title: 'క్లినికల్ ఎక్సలెన్స్', desc: 'అందరు హోమ్ డాక్టర్లు, ఫిజియోథెరపిస్టులు మరియు నర్సులు కఠినమైన క్లినికల్ సేఫ్టీ గైడ్‌లైన్స్ కింద పనిచేస్తారు.', icon: <Award className="w-5 h-5 text-teal-800" /> },
    { title: 'విశ్వసనీయత & రక్షణ', desc: 'సిబ్బంది అందరికీ కఠినమైన బ్యాక్‌గ్రౌండ్ వెరిఫికేషన్ మరియు సర్టిఫికేట్ చెక్స్ పూర్తి చేయబడతాయి.', icon: <Shield className="w-5 h-5 text-emerald-600" /> },
    { title: 'ఆత్మీయమైన సేవలు', desc: 'మేము మీ కుటుంబ సభ్యులను మా సొంత వారిలా చూసుకుంటాము, మానసిక ధైర్యాన్ని అందిస్తాము.', icon: <HeartHandshake className="w-5 h-5 text-indigo-500" /> }
  ] : [
    {
      title: 'Patient-First Focus',
      desc: 'Every medical decision and care schedule is optimized for patient recovery comfort and convenience.',
      icon: <Heart className="w-5 h-5 text-rose-500" />
    },
    {
      title: 'Clinical Excellence',
      desc: 'All home doctors, physiotherapists, and nurses operate under strict clinical safety guidelines.',
      icon: <Award className="w-5 h-5 text-teal-800" />
    },
    {
      title: 'Trust & Safety',
      desc: 'Rigorous background check verification and credential checks are completed for all staff.',
      icon: <Shield className="w-5 h-5 text-emerald-600" />
    },
    {
      title: 'Empathetic Care',
      desc: 'We care for your loved ones like family, keeping patient emotional well-being at the core.',
      icon: <HeartHandshake className="w-5 h-5 text-indigo-500" />
    }
  ];

  const stats = isTe ? [
    { value: '15,000+', label: 'చికిత్స పొందిన రోగులు' },
    { value: '15 నిమిషాలు', label: 'సగటు స్పందన సమయం' },
    { value: '120+', label: 'నర్సులు & వైద్యులు' },
    { value: '99.2%', label: 'రోగుల సంతృప్తి రేటింగ్' }
  ] : [
    { value: '15,000+', label: 'Patients Coordinated' },
    { value: '15 Min', label: 'Average Triage Callback' },
    { value: '120+', label: 'On-Duty Doctors & ICU Nurses' },
    { value: '99.2%', label: 'Clinical Satisfaction' }
  ];

  const certifications = isTe ? [
    { name: 'NABL గుర్తింపు పొందిన ల్యాబ్‌లు', desc: 'నేషనల్ అక్రిడిటేషన్ బోర్డు ద్వారా ధృవీకరించబడిన డయాగ్నస్టిక్స్ సేవలు.', icon: <BadgeCheck className="w-6 h-6 text-teal-800" /> },
    { name: 'ISO 9001:2015 సర్టిఫైడ్', desc: 'అంతర్జాతీయ ఆరోగ్య నాణ్యతా ప్రమాణాలకు అనుగుణంగా నిర్వహణ.', icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
    { name: 'NABH మార్గదర్శకాలకు లోబడి', desc: 'జాతీయ గుర్తింపు మార్గదర్శకాల ఆధారంగా రూపొందించబడిన సేవలు.', icon: <ClipboardCheck className="w-6 h-6 text-teal-800" /> }
  ] : [
    { name: 'NABL Accredited Labs', desc: 'National Accreditation Board for Testing and Calibration Laboratories certified diagnostics.', icon: <BadgeCheck className="w-6 h-6 text-teal-800" /> },
    { name: 'ISO 9001:2015 Certified', desc: 'Standard international healthcare quality management framework compliant.', icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
    { name: 'NABH Guidelines Compliant', desc: 'Home healthcare setups modeled exactly on national accreditation guidelines.', icon: <ClipboardCheck className="w-6 h-6 text-teal-800" /> }
  ];

  const processSteps = isTe ? [
    { number: '01', title: 'అభ్యర్థన నమోదు', desc: 'మీ కేర్ ప్యాకేజీని ఆన్‌లైన్‌లో ఎంచుకోండి లేదా ఉచిత కాల్‌బ్యాక్ కోసం అభ్యర్థించండి.' },
    { number: '02', title: 'వైద్యుల విశ్లేషణ', desc: 'మా సీనియర్ వైద్యులు నివేదికలను పరిశీలించి చికిత్స ప్రణాళికను సిద్ధం చేస్తారు.' },
    { number: '03', title: 'పరికరాల అమరిక', desc: 'శుభ్రపరచబడిన ఐసీయూ మెషినరీ మీ ఇంట్లో అమర్చబడుతుంది మరియు నర్సులు నియమించబడతారు.' },
    { number: '04', title: 'రోజువారీ నివేదికలు', desc: 'నర్సులు రోగి రోజువారీ నివేదికలను పర్యవేక్షణ కోసం వైద్యులకు సమర్పిస్తారు.' }
  ] : [
    { number: '01', title: 'Triage Submission', desc: 'Select your care package online or submit quick callback phone coordinates.' },
    { number: '02', title: 'Physician Audit', desc: 'Our senior consultants evaluate patient condition reports to build custom care plans.' },
    { number: '03', title: 'Bedside Deployment', desc: 'Sanitized ICU machinery is installed and background-verified nurses are assigned.' },
    { number: '04', title: 'Daily Quality Audits', desc: 'Nurses submit daily vitals logs to consulting doctors for recovery monitoring.' }
  ];

  const partnerHospitals = [
    'Apollo Hospitals Network', 'Fortis Medical Center', 'Max Healthcare Care System', 'Medanta Clinical Group', 'Columbia Asia Hospital'
  ];

  return (
    <PageLayout
      title={isTe ? "మా సేవ కేంద్రం గురించి" : "About Our Care Desk"}
      description={isTe ? "ఆసుపత్రి క్లినికల్ ఖచ్చితత్వానికి మరియు ఇంటి సౌకర్యవంతమైన రికవరీకి మధ్య అనుసంధానం." : "Bridging the gap between hospital clinical accuracy and home recovery comfort."}
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About' }]}
    >
      
      {/* 1. KEY STATISTICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((st, idx) => (
          <Card key={idx} className="text-center flex flex-col justify-center items-center py-6 shadow-sm">
            <span className="text-2xl font-black text-teal-900 tracking-tight">{st.value}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{st.label}</span>
          </Card>
        ))}
      </div>

      {/* 2. INTRODUCTION & MISSION */}
      <Card className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 !p-8">
        <div className="lg:col-span-7 flex flex-col gap-4 text-left">
          <Badge variant="teal">Supervised Home Recovery</Badge>
          <h2 className="text-lg font-bold text-slate-950 font-serif-editorial leading-tight">Hospital-Grade Quality. Bedside Comfort.</h2>
          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
            Our agency coordinates professional ICU-level medical machinery, expert nursing assistance, and consulting physician home visits directly to your bedroom. We understand that patients heal faster and with less stress when surrounded by their family.
          </p>
          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
            By avoiding ambulance commutes, inpatient waiting queues, and heavy hospital room costs, we provide a premium, affordable alternative without compromising on medical standards.
          </p>
        </div>
        
        <div className="lg:col-span-5 grid grid-cols-1 gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
          <div className="border-l-2 border-teal-800 pl-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Our Mission</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">
              To make premium, hospital-grade home recovery accessible, safe, and compassionate, helping seniors recover gracefully.
            </p>
          </div>
          <div className="border-l-2 border-emerald-600 pl-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Our Vision</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">
              To emerge as the nation's most trusted, clinical-standard home healthcare partner, recognized for physician-led protocols.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. CERTIFICATIONS & ACCREDITATIONS */}
      <div className="mb-12">
        <SectionHeading
          tag="Vetting Standards"
          title="Our Clinical Accreditations"
          description="We operate under strict guidelines to match the safety standards of premium medical centers."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <Card key={idx} className="flex gap-4">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-800 shadow-inner shrink-0 flex items-center justify-center h-fit">
                {cert.icon}
              </div>
              <div className="text-left space-y-1">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">{cert.name}</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{cert.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. OUR PROCESS TIMELINE */}
      <div className="mb-12">
        <SectionHeading
          tag="Onboarding"
          title="Our Clinical Coordination Process"
          description="How we prepare and deploy professional medical setups directly to your bedside."
          className="mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step, idx) => (
            <Card key={idx} className="text-left relative space-y-3">
              <div className="absolute top-4 right-4 text-teal-800/10 font-bold text-2xl select-none font-sans">
                {step.number}
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200/50 flex items-center justify-center font-bold text-teal-800 text-[10px]">
                {step.number}
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide pt-1">{step.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. CORE PILLARS */}
      <div className="mb-12">
        <SectionHeading
          tag="Our Pillars"
          title="Clinical Pillars of Trust"
          className="mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreValues.map((val, idx) => (
            <Card key={idx} className="text-left space-y-3">
              <div className="p-2.5 bg-slate-50 rounded-xl w-fit">
                {val.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">{val.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{val.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. PARTNER HOSPITALS */}
      <div className="mb-12 bg-slate-50/50 border border-slate-100 rounded-3xl p-8 text-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-6">Linked Referral Hospital Networks</span>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {partnerHospitals.map((hosp, idx) => (
            <span key={idx} className="text-xs font-black text-slate-400 tracking-wider uppercase opacity-80 hover:opacity-100 hover:text-teal-800 transition-all cursor-default">
              {hosp}
            </span>
          ))}
        </div>
      </div>

      {/* 7. FOUNDER & CO-FOUNDER SPOTLIGHT */}
      <div className="mb-12">
        <SectionHeading
          tag="Leadership"
          title="Our Founders' Vision"
          description="The clinical minds bridging the gap between hospital accuracy and home bedside care."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayFounders.map((f, idx) => (
            <Card key={idx} className="flex flex-col sm:flex-row gap-6 bg-gradient-to-br from-[#0a0f1d] to-[#0f172a] text-white border border-teal-850/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 relative overflow-hidden group rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-full sm:w-36 h-44 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10 relative z-10">
                <img 
                  src={f.img} 
                  alt={f.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col text-left justify-between py-1 relative z-10 grow">
                <div>
                  <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{f.role}</span>
                  <h4 className="text-base font-bold text-white mt-1 leading-tight">{f.name}</h4>
                  <p className="text-[9px] text-teal-300/80 font-bold uppercase tracking-wider mt-1">{f.experience}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold mt-3">
                    "{f.bio}"
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 8. TOP CLINICAL DOCTORS LIST */}
      <div>
        <SectionHeading
          tag="Top Doctors"
          title="Meet Our Top Doctors & Board Specialists"
          description="Experienced clinical physicians coordinating your home consultations and bedside care checks."
          className="mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDoctors.map((doc, idx) => (
            <Card key={doc._id || idx} className="!p-0 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300 group rounded-2xl border border-slate-100">
              <div className="h-60 overflow-hidden relative w-full bg-slate-100 border-b border-slate-100">
                <img 
                  src={doc.img} 
                  alt={doc.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-teal-900 text-teal-200 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-teal-700/50 shadow">
                  {doc.experience}
                </div>
              </div>
              <div className="p-5 text-left grow flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-teal-800 uppercase tracking-widest">{doc.speciality || 'General Medicine'}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-tight">{doc.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-tight">{doc.designation}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold mt-3">{doc.bio}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </PageLayout>
  );
};

export default About;
