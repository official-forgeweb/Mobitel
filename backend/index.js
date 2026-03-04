const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Import routes
const locationRoute = require('./routes/locationRoute');
const adminRoute = require('./routes/adminRoute');
const cmsRoute = require('./routes/cmsRoute');
const shopsRoute = require('./routes/shopsRoute');
const requestsRoute = require('./routes/requestsRoute');
const partnersRoute = require('./routes/partnersRoute');
const uploadRoute = require('./routes/uploadRoute');
const bookingRoute = require('./routes/bookingRoute');
const workerRoute = require('./routes/workerRoute');
const brandRoute = require('./routes/brandRoute');
const deviceModelRoute = require('./routes/deviceModelRoute');
const serviceRoute = require('./routes/serviceRoute');
const pricingRoute = require('./routes/pricingRoute');
const timeSlotRoute = require('./routes/timeSlotRoute');
const settingsRoute = require('./routes/settingsRoute');
const reportsRoute = require('./routes/reportsRoute');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
            callback(null, true);
        } else {
            callback(new Error('CORS_ERROR'));
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Existing Routes ───
app.use('/api/location', locationRoute);
app.use('/api/admin', adminRoute);
app.use('/api/cms', cmsRoute);
app.use('/api/shops', shopsRoute);
app.use('/api/requests', requestsRoute);
app.use('/api/partners', partnersRoute);
app.use('/api/upload', uploadRoute);

// ─── New Routes ───
app.use('/api/bookings', bookingRoute);
app.use('/api/workers', workerRoute);
app.use('/api/brands', brandRoute);
app.use('/api/device-models', deviceModelRoute);
app.use('/api/services', serviceRoute);
app.use('/api/pricing', pricingRoute);
app.use('/api/time-slots', timeSlotRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/reports', reportsRoute);

// Basic route
app.get('/', (req, res) => {
    res.send('Mobitel Backend API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.message === 'CORS_ERROR') {
        return res.status(403).json({ error: 'Origin not allowed by CORS' });
    }
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// MongoDB Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
    console.warn('⚠️ WARNING: MONGO_URI is not defined in .env.');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
