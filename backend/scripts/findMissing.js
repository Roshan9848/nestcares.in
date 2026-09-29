const fs = require('fs');
const path = require('path');

function scan(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules') scan(full);
    } else if (item.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('<ChevronRight')) {
        const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/);
        if (!importMatch || !importMatch[1].includes('ChevronRight')) {
          console.log('🚨 Missing ChevronRight in:', full);
        }
      }
    }
  }
}

scan('frontend/src');
