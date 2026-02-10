
const axios = require('axios');

(async () => {
  console.log('Testing API connection...');
  try {
    const res = await axios.get('http://localhost:4000/api/health', { timeout: 2000 });
    console.log('✅ API is running!', res.data);
  } catch (e) {
    console.error('❌ API connection failed:', e.message);
    if (e.code === 'ECONNREFUSED') {
      console.error('   Hint: The server might not be running on port 4000.');
    }
  }
})();
