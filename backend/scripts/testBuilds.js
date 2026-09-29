const { execSync } = require('child_process');
const fs = require('fs');

const appContent = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const pages = [
  './pages/Home',
  './pages/Services',
  './pages/ServiceDetail',
  './pages/SubServiceDetail',
  './pages/About',
  './pages/Contact',
  './pages/BookService',
  './pages/Login',
  './pages/DoctorDashboard',
  './admin/Dashboard'
];

for (const p of pages) {
  const testApp = `import React from 'react';\nimport Comp from '${p}';\nexport default function App() { return <Comp />; }\n`;
  fs.writeFileSync('frontend/src/App.jsx', testApp);
  try {
    execSync('npx vite build', { cwd: 'frontend', stdio: 'pipe' });
    console.log('✅ Passed build:', p);
  } catch (err) {
    console.log('❌ FAILED build:', p);
    if (err.stderr) console.log(err.stderr.toString());
  }
}

// Restore original App.jsx
fs.writeFileSync('frontend/src/App.jsx', appContent);
console.log('Done testing pages.');
