const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../frontend/src/admin/Dashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace any remaining axios calls with apiClient
content = content.split('axios.post(').join('apiClient.post(');
content = content.split('axios.get(').join('apiClient.get(');
content = content.split('axios.put(').join('apiClient.put(');
content = content.split('axios.delete(').join('apiClient.delete(');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ All axios calls in Dashboard.jsx successfully converted to apiClient!');
