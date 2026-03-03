const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// wait, native fetch is in node 18+
fetch('http://localhost:5001/api/bookings', {
  method: 'POST',
  body: JSON.stringify({
    customerName:'Test User',
    phone:'1234567890',
    brand:'Apple',
    model:'iPhone 14',
    serviceType:'shop',
    email:'sunilbaghel93100@gmail.com'
  }),
  headers: {'Content-Type': 'application/json'}
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Body:', await r.text());
}).catch(console.error);
