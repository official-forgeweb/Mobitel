const jwt = require('jsonwebtoken');
const token = jwt.sign({ role: 'admin', name: 'Admin' }, 'your-super-secret-jwt-key-change-this', { expiresIn: '1d' });
const args = {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
};
import('node-fetch').then(({default: fetch}) => {
  fetch('http://localhost:5001/api/bookings/stats/overview', args)
    .then(async r => {
      console.log('Status:', r.status);
      console.log('Body:', await r.text());
    })
    .catch(console.error);
});
