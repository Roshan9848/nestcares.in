const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Faq = require('../models/Faq');
const Settings = require('../models/Settings');

const defaultServices = [
  {
    title: 'Doctor Consultation',
    slug: 'doctor-consultation',
    shortDescription: 'Qualified doctors visiting your home for personalized diagnosis and treatment.',
    fullDescription: 'Our Doctor Consultation service brings experienced general physicians and specialists directly to your home. This eliminates the stress of travel, long waiting times in clinics, and exposure to hospital-acquired infections.',
    bannerImage: '/uploads/doctor_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Personalized attention in the comfort of your home',
      'Thorough clinical examination without travel exhaustion',
      'Coordination of diagnostics and specialist referrals'
    ],
    subServices: [
      { name: 'Home Doctor Visit', description: 'General physician visits bedside for diagnoses, physical checkups, and prescription slips.', price: 1500, bookable: true, active: true },
      { name: 'Tele Consultation', description: 'Direct audio call consult with senior practitioners for mild symptoms and refills.', price: 500, bookable: true, active: true },
      { name: 'Video Consultation', description: 'Remote video call interface with clinical specialists for diagnosis review.', price: 800, bookable: true, active: true }
    ],
    faqs: [
      { question: 'How long does a home doctor visit take?', answer: 'Usually, a visit takes between 30 to 45 minutes, allowing a thorough clinical check.' }
    ],
    price: 1500,
    bookable: true,
    active: true,
    displayOrder: 0,
    icon: 'UserCheck',
    preparationInstructions: 'Please keep past medical reports, discharge summaries, and prescriptions ready.'
  },
  {
    title: 'Ambulance Services',
    slug: 'ambulance-services',
    shortDescription: '24/7 advanced life support and basic life support medical transport.',
    fullDescription: 'We provide prompt, secure, and fully equipped Ambulance Services for both emergencies and non-emergency patient transfers.',
    bannerImage: '/uploads/ambulance_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      '24/7 availability with rapid response times',
      'Advanced medical transport monitoring and oxygen support'
    ],
    subServices: [
      { name: 'Basic Ambulance', description: 'Basic Life Support (BLS) vehicle for transport, equipped with stretchers and oxygen supply.', price: 3000, bookable: true, active: true },
      { name: 'Ventilator Ambulance', description: 'Advanced Life Support (ALS) vehicle with ICU ventilators, multi-para monitor, and emergency paramedic.', price: 8000, bookable: true, active: true }
    ],
    faqs: [
      { question: 'Do you provide out-of-city transport?', answer: 'Yes. We support patient transfers across cities with ICU monitoring.' }
    ],
    price: 3000,
    bookable: true,
    active: true,
    displayOrder: 1,
    icon: 'Truck',
    preparationInstructions: 'Ensure the patient has emergency vitals summaries before loading.'
  },
  {
    title: 'Nursing Services',
    slug: 'nursing-services',
    shortDescription: 'Compassionate, professional nursing care for short-term and long-term recovery.',
    fullDescription: 'Our registered and associate nurses provide complete home nursing care at your bedside, ensuring hospital-level nursing protocols are followed.',
    bannerImage: '/uploads/nurse_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Highly trained, certified nursing professionals',
      'Care plan customized to doctor prescriptions'
    ],
    subServices: [
      { name: 'General Nursing Care', description: 'Bedside assistance for monitoring vitals, hygiene, and daily medical logs.', price: 2500, bookable: true, active: true },
      { name: 'Emergency Nursing Care', description: 'Immediate clinical nursing for critical vital drops and trauma recovery.', price: 3500, bookable: true, active: true },
      { name: 'Wound Care Management', description: 'Aseptic dressing changes for diabetic or surgical wounds.', price: 1200, bookable: true, active: true },
      { name: 'Bed Sore Care', description: 'Positioning plans, air bed setups, and specialized sore dressings.', price: 1500, bookable: true, active: true },
      { name: 'Tracheostomy Care', description: 'Cannula cleaning, suctioning, and stoma site cleaning.', price: 1800, bookable: true, active: true },
      { name: 'Dressing Services', description: 'Post-op clinical dressing changes and stitch removals.', price: 800, bookable: true, active: true },
      { name: 'VAC Therapy', description: 'Vacuum-assisted wound closure device installation and foam dressing replacement.', price: 4500, bookable: true, active: true },
      { name: 'Post-Surgery Nursing Care', description: 'Rehabilitation support, vitals charts, and post-op drug administration.', price: 2500, bookable: true, active: true },
      { name: 'Elderly Patient Care', description: 'Elderly assistance for daily routines, drug feeding, and companionship.', price: 2000, bookable: true, active: true },
      { name: 'Long-Term Home Nursing Support', description: 'Monthly subscription nursing shifts (12/24 hours) for bedridden patients.', price: 50000, bookable: true, active: true }
    ],
    faqs: [
      { question: 'What is the duration of a nursing shift?', answer: 'We offer 12-hour shifts as well as 24-hour live-in support.' }
    ],
    price: 2500,
    bookable: true,
    active: true,
    displayOrder: 2,
    icon: 'HeartPulse',
    preparationInstructions: 'A clean, well-ventilated bedside space with access to warm water is recommended.'
  },
  {
    title: 'ICU Setup at Home',
    slug: 'icu-setup-at-home',
    shortDescription: 'Comprehensive critical care setup with ventilators, monitors, and 24/7 nursing.',
    fullDescription: 'For patients who require intensive monitoring but prefer recovering at home, we install a complete Intensive Care Unit (ICU) setup.',
    bannerImage: '/uploads/icu_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Hospital-grade critical care equipment',
      '24/7 dedicated critical care nursing staff'
    ],
    subServices: [
      { name: 'ICU Hospital Bed', description: 'Motorized hospital-grade ICU bed with back/knee raise and safety side rails.', price: 3500, bookable: true, active: true },
      { name: 'Patient Monitor', description: 'Multi-parameter monitor with alarms for pulse, oxygen levels, and temperature.', price: 2000, bookable: true, active: true },
      { name: 'Oxygen Concentrator', description: 'Bedside oxygen extraction unit supplying up to 5/10 L/min of medical oxygen.', price: 4500, bookable: true, active: true },
      { name: 'Oxygen Cylinder', description: 'Back-up high pressure cylinder for power cuts and transfers.', price: 1500, bookable: true, active: true },
      { name: 'BiPAP Machine', description: 'Non-invasive ventilator supplying bilevel positive airway pressures.', price: 3000, bookable: true, active: true },
      { name: 'CPAP Machine', description: 'Continuous positive airway pressure unit for sleep apnea.', price: 2500, bookable: true, active: true },
      { name: 'Nebulizer', description: 'Compressed air device for inhaling medication mist.', price: 800, bookable: true, active: true },
      { name: 'Suction Machine', description: 'Oral and tracheal aspirator for fluid suctioning.', price: 1200, bookable: true, active: true },
      { name: 'Pulse Oximeter', description: 'Handheld monitor check device for SpO2 and pulse readings.', price: 300, bookable: true, active: true },
      { name: 'Infusion Pump', description: 'Micro-dose drug administration pump.', price: 1000, bookable: true, active: true },
      { name: 'Complete Home ICU Setup', description: 'Bundle setup of hospital bed, monitor, concentrator, backup cylinder, suction machine, and installation.', price: 15000, bookable: true, active: true }
    ],
    faqs: [
      { question: 'How long does setup take?', answer: 'Typically, it takes 4 to 6 hours to install the medical machinery.' }
    ],
    price: 12000,
    bookable: true,
    active: true,
    displayOrder: 3,
    icon: 'Activity',
    preparationInstructions: 'Requires a dedicated room, continuous power supply with UPS backup.'
  },
  {
    title: 'Laboratory Services',
    slug: 'laboratory-services',
    shortDescription: 'Diagnostic blood tests and sample collection from your home.',
    fullDescription: 'Get accurate medical diagnostics without leaving your house. Our certified phlebotomists visit your home for sample collection.',
    bannerImage: '/uploads/lab_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Hassle-free, hygienic home sample collection',
      'NABL-accredited diagnostic accuracy'
    ],
    subServices: [
      { name: 'Home Blood Sample Collection', description: 'Certified phlebotomist visit for collecting blood samples aseptic vials.', price: 200, bookable: true, active: true },
      { name: 'Blood Tests', description: 'Complete Blood Count (CBC), Sugar Fasting, Liver (LFT), and Kidney Panels (KFT).', price: 800, bookable: true, active: true },
      { name: 'Urine Sample Collection', description: 'Container collection and lab transfer for urine analysis.', price: 300, bookable: true, active: true },
      { name: 'Diagnostic Sample Collection', description: 'Specialized diagnostic collections (swabs, skin scrapes) for cultures.', price: 500, bookable: true, active: true }
    ],
    faqs: [
      { question: 'When do I get my reports?', answer: 'Digital reports are emailed in 12 to 24 hours.' }
    ],
    price: 800,
    bookable: true,
    active: true,
    displayOrder: 4,
    icon: 'FlaskConical',
    preparationInstructions: 'Fasting of 8 to 12 hours is required for sugar/lipid tests.'
  },
  {
    title: 'Pharmacy',
    slug: 'pharmacy',
    shortDescription: 'Prescription medicines delivered directly to your doorstep.',
    fullDescription: 'Never run out of essential medicines. Upload your prescription and our pharmacy team will deliver verified medications directly to your home.',
    bannerImage: '/uploads/pharmacy_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      '100% genuine and verified medicines',
      'Timely doorstep deliveries'
    ],
    subServices: [
      { name: 'Doorstep Medicine Delivery', description: 'Prompt dispatch of uploaded prescription drugs.', price: 0, bookable: true, active: true },
      { name: 'Monthly Medicine Refills', description: 'Subscribed refills for diabetes, blood pressure medications.', price: 0, bookable: true, active: true },
      { name: 'Prescription Medicine Delivery', description: 'Vetted pharmacist verification and dispatch coordinates.', price: 0, bookable: true, active: true }
    ],
    faqs: [
      { question: 'Can I order without prescription?', answer: 'No. Prescription-only medicines require uploading a valid prescription.' }
    ],
    price: 0,
    bookable: false,
    active: true,
    displayOrder: 5,
    icon: 'Pills',
    preparationInstructions: 'Please upload a clear picture of your doctor’s prescription sheet.'
  },
  {
    title: 'Physiotherapy',
    slug: 'physiotherapy',
    shortDescription: 'Professional physical therapy for pain relief, stroke recovery, and mobility.',
    fullDescription: 'Our certified physiotherapists design customized home rehabilitation programs.',
    bannerImage: '/uploads/physio_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Tailored exercise programs for faster recovery',
      'Use of modern therapeutic modalities'
    ],
    subServices: [
      { name: 'Home Physiotherapy', description: 'Standard muscle mobilization, workout reviews, and dry needling.', price: 1000, bookable: true, active: true },
      { name: 'Orthopedic Physiotherapy', description: 'Rehabilitation following joint replacements, fractures, or arthritis pain.', price: 1200, bookable: true, active: true },
      { name: 'Neurological Rehabilitation', description: 'Re-training motor pathways for stroke, Parkinson\'s, or spinal injuries.', price: 1505, bookable: true, active: true },
      { name: 'Post-Surgery Rehabilitation', description: 'Post-op knee/hip mobility exercises to gain movement ranges.', price: 1200, bookable: true, active: true },
      { name: 'Elderly Mobility Therapy', description: 'Balance, gait training, and falls-prevention exercises for seniors.', price: 1000, bookable: true, active: true }
    ],
    faqs: [
      { question: 'How many sessions will I need?', answer: 'Our therapist does a baseline mobility assessment on the first visit.' }
    ],
    price: 1000,
    bookable: true,
    active: true,
    displayOrder: 6,
    icon: 'Accessibility',
    preparationInstructions: 'We recommend wearing loose, comfortable clothing.'
  },
  {
    title: 'Dietician Consultation',
    slug: 'dietician-consultation',
    shortDescription: 'Customized clinical nutrition plans for weight, diabetes, and cardiovascular health.',
    fullDescription: 'Eat right to heal faster and stay healthy. Our clinical dieticians offer home visits and virtual sessions to formulate highly personalized nutrition plans.',
    bannerImage: '/uploads/diet_banner.jpg',
    galleryImages: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600'],
    benefits: [
      'Detailed diet assessment based on medical history',
      'Customized meal charts based on regional dietary habits'
    ],
    subServices: [
      { name: 'Personalized Diet Plans', description: 'Customized food charts based on height, weight, and clinical parameters.', price: 1200, bookable: true, active: true },
      { name: 'Clinical Nutrition', description: 'Specialized nutritional plans for kidney disease, heart issues, and cancer.', price: 1500, bookable: true, active: true },
      { name: 'Weight Management', description: 'Structured calorie deficit/surplus guidance charts.', price: 1000, bookable: true, active: true },
      { name: 'Diabetes Diet Consultation', description: 'Low glycemic index charts and glucose tracker coordination.', price: 1200, bookable: true, active: true },
      { name: 'Nutrition Counseling', description: 'Counseling on healthy eating habits, food substitutions, and lifestyle improvements.', price: 1000, bookable: true, active: true }
    ],
    faqs: [
      { question: 'Can the dietician design meals for diabetic patients?', answer: 'Yes. Our clinical dieticians are specialists in therapeutic diets.' }
    ],
    price: 1200,
    bookable: true,
    active: true,
    displayOrder: 7,
    icon: 'Apple',
    preparationInstructions: 'Please gather your recent lab test reports.'
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/home-healthcare';
    console.log('Connecting to database for seeding updated service structures...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected.');

    // Clear old services to avoid collision
    await Service.deleteMany({});
    console.log('Cleared old service catalog.');

    // Insert updated services
    await Service.insertMany(defaultServices);
    console.log('✅ Default upgraded service specifications seeded successfully.');

    // Seed Admin User
    const adminEmail = 'rohith@nestcares.in';
    const adminPassword = 'Roya@1522';
    
    await User.deleteMany({ role: 'admin' });
    
    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log(`✅ Admin user created (Email: ${adminEmail}, Password: ${adminPassword})`);

    // Seed Settings (only if missing)
    const settingsList = [
      {
        key: 'homepage',
        value: {
          heroHeading: 'Hospital-Quality Medical Care, at the Comfort of Your Home',
          heroDescription: 'Avoid stressful travel and hospital waiting rooms. We bring certified doctors, critical ICU setups, skilled nurses, and emergency support directly to your bedside.',
          heroBgImage: '/uploads/hero_banner.jpg',
          ctaText: 'Book a Service',
          whyChooseUs: [
            { title: 'Experienced Clinicians', desc: 'All care is delivered by licensed medical professionals with intensive hospital backgrounds.' },
            { title: 'Hospital-Grade Equipment', desc: 'We install high-quality ventilators, monitors, and specialized medical beds directly at home.' },
            { title: '24/7 Quick Response', desc: 'Dedicated round-the-clock ambulance dispatch and medical helpline at your disposal.' },
            { title: 'Affordable Recovery', desc: 'Save up to 60% compared to extended hospital ICU or clinical boarding charges.' }
          ],
          howItWorks: [
            { step: '1', title: 'Request Service', desc: 'Fill out our simple form or contact us via call/WhatsApp to describe your clinical needs.' },
            { step: '2', title: 'Medical Assessment', desc: 'Our head coordinator reviews and aligns with doctors to design a custom care plan.' },
            { step: '3', title: 'Expert Deployment', desc: 'We deliver medical machinery, dispatch professionals, and coordinate immediate setup.' },
            { step: '4', title: 'Continuous Monitoring', desc: 'Get ongoing clinical audits, physician visits, and emergency support backup.' }
          ]
        }
      },
      {
        key: 'contact',
        value: {
          phoneNumbers: ['+91 92488 49388', '+91 63035 91409'],
          emailAddress: 'nestcares.in@gmail.com',
          whatsappNumber: '+91 92488 49388',
          officeAddress: 'Chandra Shekar Colony, Nizamabad, Telangana - 503002',
          workingHours: 'Mon - Sun: 24/7 Available for Emergencies',
          emergencyContact: '+91 92488 49388',
          googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60320.09117621495!2d78.06456073100346!3d18.672462371908477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcddb435ff51ca1%3A0x67dbb8a0717e1329!2sNizamabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin',
          socials: {
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com'
          }
        }
      },
      {
        key: 'email',
        value: {
          smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: parseInt(process.env.SMTP_PORT) || 465,
          smtpUser: process.env.SMTP_USER || 'nestcares.in@gmail.com',
          smtpPass: process.env.SMTP_PASS || '',
          businessEmail: process.env.BUSINESS_EMAIL || 'nestcares.in@gmail.com',
          senderName: process.env.SENDER_NAME || 'Nest Cares Support',
          templates: {
            patientConfirmation: 'Dear {{patientName}},\n\nThank you for choosing Nest Cares. We have received your booking request for {{serviceName}} on {{date}} at {{time}}.\n\nOur medical coordinator will call you shortly at {{mobile}} to confirm your appointment.\n\nAddress Details:\n{{address}}\n\nWarm regards,\nNest Cares Coordination Team',
            adminNotification: 'Hello Admin,\n\nA new booking request has been submitted:\n\nPatient Name: {{patientName}}\nPhone: {{mobile}}\nEmail: {{email}}\nService: {{serviceName}}\nDate: {{date}}\nTime: {{time}}\nAddress: {{address}}\nNotes: {{notes}}'
          }
        }
      },
      {
        key: 'web',
        value: {
          companyName: 'Nest Cares',
          logoUrl: '/logo.png',
          faviconUrl: '/favicon.svg',
          footerContent: 'Providing hospital-quality medical services at the comfort of your home. Trusted by over 10,000+ families in Nizamabad.',
          copyright: '© 2026 Nest Cares Home Healthcare Services. All rights reserved.',
          seoTitle: 'Nest Cares - Best Home Healthcare Services in Nizamabad',
          seoDescription: 'Hospital-level ICU setups, experienced home doctors, specialized nurses, and 24/7 ambulance services at your bedside in Nizamabad, Telangana.',
          googleAnalyticsCode: 'UA-XXXXX-X'
        }
      }
    ];

    for (const setting of settingsList) {
      await Settings.findOneAndReplace({ key: setting.key }, setting, { upsert: true });
      console.log(`... Settings for "${setting.key}" initialized/updated.`);
    }

    console.log('🎉 Upgraded seeding successfully completed!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
