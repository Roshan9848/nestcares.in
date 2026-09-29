const fs = require('fs');
const path = require('path');

// Check all files in frontend directory for UTF-16 BOM or non-UTF8 encodings
function checkEncoding(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      checkEncoding(full);
    } else {
      const buf = fs.readFileSync(full);
      // Check for UTF-16 LE/BE BOM
      if (buf[0] === 0xff && buf[1] === 0xfe) {
        console.log('🚨 UTF-16 LE BOM found in:', full);
      } else if (buf[0] === 0xfe && buf[1] === 0xff) {
        console.log('🚨 UTF-16 BE BOM found in:', full);
      } else if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        console.log('🚨 UTF-8 with BOM found in:', full);
        // Strip BOM
        fs.writeFileSync(full, buf.slice(3));
        console.log('Stripped BOM from:', full);
      }
    }
  }
}

checkEncoding('frontend');
console.log('BOM check complete.');
