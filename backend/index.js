const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const locationRoute = require('./routes/locationRoute');
const adminRoute = require('./routes/adminRoute');
const cmsRoute = require('./routes/cmsRoute');
const shopsRoute = require('./routes/shopsRoute');
const requestsRoute = require('./routes/requestsRoute');
const partnersRoute = require('./routes/partnersRoute');
const uploadRoute = require('./routes/uploadRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/location', locationRoute);
app.use('/api/admin', adminRoute);
app.use('/api/cms', cmsRoute);
app.use('/api/shops', shopsRoute);
app.use('/api/requests', requestsRoute);
app.use('/api/partners', partnersRoute);
app.use('/api/upload', uploadRoute);

// Basic route
app.get('/', (req, res) => {
    res.send('Mobitel Backend API is running');
});

// MongoDB Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
    console.warn('⚠️ WARNING: MONGO_URI is not defined in .env.');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
