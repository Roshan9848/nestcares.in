const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (modelName) => {
  let name = modelName.toLowerCase();
  if (!name.endsWith('s')) {
    name = name + 's';
  }
  return path.join(DATA_DIR, `${name}.json`);
};

const readJSONFile = (modelName) => {
  const filePath = getFilePath(modelName);
  if (!fs.existsSync(filePath)) {
    // Return empty array or seed defaults
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeJSONFile = (modelName, data) => {
  const filePath = getFilePath(modelName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// Initialize JSON files with seed data if they don't exist
const checkAndSeedJSON = () => {
  const usersPath = getFilePath('User');
  if (!fs.existsSync(usersPath)) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('Roya@1522', salt);
    writeJSONFile('User', [
      {
        _id: 'admin_seed_id_1',
        name: 'Super Admin Rohith',
        email: 'rohith@nestcares.in',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'admin_seed_id_2',
        name: 'Nest Cares Admin',
        email: 'nestcares.in@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ]);
    console.log('✅ Local JSON Users seeded (rohith@nestcares.in & nestcares.in@gmail.com)');
  }

  const settingsPath = getFilePath('Settings');
  if (!fs.existsSync(settingsPath)) {
    writeJSONFile('Settings', [
      {
        _id: 'set_home',
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
        _id: 'set_contact',
        key: 'contact',
        value: {
          phoneNumbers: ['+91 92488 49388', '+91 92488 49389'],
          emailAddress: 'nestcares.in@gmail.com',
          whatsappNumber: '+91 92488 49388',
          officeAddress: 'House No: 5-6-745, Beside Vijaya High School, Pragathi Nagar, Nizamabad, Telangana - 503002',
          workingHours: 'Mon - Sun: 24/7 Available for Emergencies',
          emergencyContact: '+91 92488 49388',
          googleMapsLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562013898231!2d77.2281987!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTMnNDEuNSJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin',
          socials: {
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com'
          }
        }
      },
      {
        _id: 'set_email',
        key: 'email',
        value: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'nestcares.in@gmail.com',
          smtpPass: '',
          businessEmail: 'nestcares.in@gmail.com',
          senderName: 'Nest Cares Support',
          templates: {
            patientConfirmation: 'Dear {{patientName}},\n\nThank you for choosing Nest Cares. We have received your booking request for {{serviceName}} on {{date}} at {{time}}.\n\nOur medical coordinator will call you shortly at {{mobile}} to confirm your appointment and assign your care team.\n\nAddress Details:\n{{address}}\n\nWarm regards,\nNest Cares Team',
            adminNotification: 'Hello Admin,\n\nA new booking request has been submitted:\n\nPatient Name: {{patientName}}\nPhone: {{mobile}}\nEmail: {{email}}\nService: {{serviceName}}\nDate: {{date}}\nTime: {{time}}\nAddress: {{address}}\nNotes: {{notes}}\n\nPlease review and approve this booking in your Dashboard.'
          }
        }
      },
      {
        _id: 'set_web',
        key: 'web',
        value: {
          companyName: 'Nest Cares',
          logoUrl: '',
          faviconUrl: '',
          footerContent: 'Providing hospital-level medical services at the comfort of your home. Trusted by over 10,000+ families.',
          copyright: '© 2026 Nest Cares Home Healthcare Services. All rights reserved.',
          seoTitle: 'CareHome - Premium Home Healthcare Services',
          seoDescription: 'Hospital-level ICU setups, experienced home doctors, specialized nurses, and 24/7 ambulance services at your bedside.',
          googleAnalyticsCode: 'UA-XXXXX-X'
        }
      }
    ]);
    console.log('✅ Local JSON Settings seeded');
  }

  const servicesPath = getFilePath('Service');
  if (!fs.existsSync(servicesPath)) {
    const services = [
      {
        _id: 'srv_1',
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
          { name: 'Home Doctor Visit', description: 'General physician visits bedside for diagnoses, checkups, and prescriptions.', price: 1500, bookable: true, active: true },
          { name: 'Tele Consultation', description: 'Direct audio call consult with senior practitioners for mild symptoms and refills.', price: 505, bookable: true, active: true },
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
        preparationInstructions: 'Please keep past medical reports, discharge summaries, and prescriptions ready.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_2',
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
        preparationInstructions: 'Ensure the patient has emergency vitals summaries before loading.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_3',
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
          { name: 'Post-Surgery Nursing Care', description: 'Rehabilitation support, vitals charts, and post-op drug administration.', price: 2505, bookable: true, active: true },
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
        preparationInstructions: 'A clean, well-ventilated bedside space with access to warm water is recommended.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_4',
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
        preparationInstructions: 'Requires a dedicated room, continuous power supply with UPS backup.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_5',
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
        preparationInstructions: 'Fasting of 8 to 12 hours is required for sugar/lipid tests.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_6',
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
        preparationInstructions: 'Please upload a clear picture of your doctor’s prescription sheet.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_7',
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
          { name: 'Neurological Rehabilitation', description: 'Re-training motor pathways for stroke, Parkinson\'s, or spinal injuries.', price: 1500, bookable: true, active: true },
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
        preparationInstructions: 'We recommend wearing loose, comfortable clothing.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'srv_8',
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
        preparationInstructions: 'Please gather your recent lab test reports.',
        createdAt: new Date().toISOString()
      }
    ];
    writeJSONFile('Service', services);
    console.log('✅ Local JSON Services seeded (8 services)');
  }

  const testimonialsPath = getFilePath('Testimonial');
  if (!fs.existsSync(testimonialsPath)) {
    writeJSONFile('Testimonial', [
      {
        _id: 't_1',
        name: 'Rajesh Sharma',
        text: 'Setting up the ICU at home for my father was the best decision. The equipment was state-of-the-art and the 24/7 nursing team was extremely professional and compassionate. Highly recommend!',
        designation: 'Son of patient, Delhi',
        image: '',
        order: 0,
        createdAt: new Date().toISOString()
      },
      {
        _id: 't_2',
        name: 'Dr. Priya Nair',
        text: 'As a practicing physician, I always refer my patients to their home nursing services. Their post-operative dressing and drug administration compliance are excellent. A very reliable team.',
        designation: 'Consultant Cardiologist',
        image: '',
        order: 1,
        createdAt: new Date().toISOString()
      },
      {
        _id: 't_3',
        name: 'Sarah D\'Souza',
        text: 'My grandmother was suffering from severe knee pain. The physiotherapist visited us three times a week. Within a month, her mobility improved drastically. Booking was very simple.',
        designation: 'Granddaughter of patient',
        image: '',
        order: 2,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  const faqsPath = getFilePath('Faq');
  if (!fs.existsSync(faqsPath)) {
    writeJSONFile('Faq', [
      {
        _id: 'faq_1',
        question: 'How do I book a home healthcare service?',
        answer: 'You can book by filling out the form on our "Book a Service" page, calling our emergency number, or sending a message on WhatsApp. Our coordinator will call you back within 15 minutes to confirm details.',
        order: 0,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'faq_2',
        question: 'Are your medical staff qualified and verified?',
        answer: 'Yes. All our doctors, nurses, physiotherapists, and care attendants undergo rigorous background checks, credential validation, and clinical evaluations before they are deployed to patients.',
        order: 1,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'faq_3',
        question: 'What happens in case of a medical emergency at home?',
        answer: 'We provide 24/7 emergency support. If a patient under our care experiences an acute emergency, our standby nursing staff coordinates immediate transport via our dedicated BLS/ALS ambulances.',
        order: 2,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'faq_4',
        question: 'How does the ICU Setup at Home work?',
        answer: 'We deliver and install all required hospital-grade critical care equipment (ventilator, monitor, infusion pump, etc.) and deploy ICU-trained nurses. A consulting intensivist doctor oversees the patient via daily visits and remote telemetry.',
        order: 3,
        createdAt: new Date().toISOString()
      }
    ]);
  }
};

checkAndSeedJSON();

// Repository helper functions
const dbHelper = {
  find: async (model, filter = {}, sort = null) => {
    if (global.dbConnected) {
      let query = model.find(filter);
      if (sort) query = query.sort(sort);
      return await query;
    } else {
      const data = readJSONFile(model.modelName);
      let results = data.filter(item => {
        for (let key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });

      if (sort) {
        const sortKey = Object.keys(sort)[0];
        const sortOrder = sort[sortKey];
        results.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
      }
      return results;
    }
  },

  findOne: async (model, filter = {}) => {
    if (global.dbConnected) {
      return await model.findOne(filter);
    } else {
      const data = readJSONFile(model.modelName);
      return data.find(item => {
        for (let key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      }) || null;
    }
  },

  findById: async (model, id) => {
    if (global.dbConnected) {
      return await model.findById(id);
    } else {
      const data = readJSONFile(model.modelName);
      return data.find(item => item._id === id || item.id === id) || null;
    }
  },

  create: async (model, docData) => {
    if (global.dbConnected) {
      return await model.create(docData);
    } else {
      const data = readJSONFile(model.modelName);
      const newDoc = {
        _id: crypto.randomBytes(12).toString('hex'),
        ...docData,
        createdAt: new Date().toISOString()
      };
      data.push(newDoc);
      writeJSONFile(model.modelName, data);
      return newDoc;
    }
  },

  findByIdAndUpdate: async (model, id, updateData, options = {}) => {
    if (global.dbConnected) {
      return await model.findByIdAndUpdate(id, updateData, { new: true, ...options });
    } else {
      const data = readJSONFile(model.modelName);
      const index = data.findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      
      const updated = {
        ...data[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      data[index] = updated;
      writeJSONFile(model.modelName, data);
      return updated;
    }
  },

  findOneAndUpdate: async (model, filter, updateData, options = {}) => {
    if (global.dbConnected) {
      return await model.findOneAndUpdate(filter, updateData, { new: true, upsert: true, ...options });
    } else {
      const data = readJSONFile(model.modelName);
      let index = data.findIndex(item => {
        for (let key in filter) {
          if (item[key] !== filter[key]) return false;
        }
        return true;
      });

      if (index === -1) {
        if (options.upsert) {
          const newDoc = {
            _id: crypto.randomBytes(12).toString('hex'),
            ...filter,
            ...updateData,
            createdAt: new Date().toISOString()
          };
          data.push(newDoc);
          writeJSONFile(model.modelName, data);
          return newDoc;
        }
        return null;
      }

      const updated = {
        ...data[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      data[index] = updated;
      writeJSONFile(model.modelName, data);
      return updated;
    }
  },

  findByIdAndDelete: async (model, id) => {
    if (global.dbConnected) {
      return await model.findByIdAndDelete(id);
    } else {
      const data = readJSONFile(model.modelName);
      const index = data.findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      const removed = data[index];
      data.splice(index, 1);
      writeJSONFile(model.modelName, data);
      return removed;
    }
  },

  countDocuments: async (model, filter = {}) => {
    if (global.dbConnected) {
      return await model.countDocuments(filter);
    } else {
      const data = readJSONFile(model.modelName);
      return data.filter(item => {
        for (let key in filter) {
          if (filter[key] !== undefined && item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      }).length;
    }
  }
};

module.exports = dbHelper;
