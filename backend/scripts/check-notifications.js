const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const NotificationLog = require('../models/NotificationLog');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const logs = await NotificationLog.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent Notification Logs:');
        console.log(JSON.stringify(logs, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
