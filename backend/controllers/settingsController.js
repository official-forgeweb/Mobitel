const Setting = require('../models/Setting');

// Default settings
const DEFAULTS = {
    shopProfile: {
        name: 'Mobitel',
        address: '',
        phone: '+919876543210',
        email: 'contact@mobitel.in',
        logo: '',
        description: 'Your Trusted Mobile Repair Partner'
    },
    notificationPreferences: {
        adminEmails: [],
        adminWhatsapp: [],
        events: {
            newBooking: { adminEmail: true, adminWhatsapp: true, customerEmail: true, customerWhatsapp: true },
            statusChanged: { customerEmail: true, customerWhatsapp: true },
            jobCompleted: { adminEmail: true, adminWhatsapp: true, customerEmail: true, customerWhatsapp: true },
            readyForPickup: { customerEmail: true, customerWhatsapp: true }
        }
    },
    bookingSettings: {
        leadTimeHours: 2,
        maxAdvanceDays: 30
    },
    paymentSettings: {
        full_payment_enabled: true,
        advance_payment_enabled: true,
        advance_type: 'fixed', // 'fixed' or 'percentage'
        advance_fixed_amount: 299,
        advance_percentage: 20,
        pay_at_store_enabled: true,
        test_mode: true
    }
};

const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        let setting = await Setting.findOne({ key });
        if (!setting && DEFAULTS[key]) {
            setting = { key, value: DEFAULTS[key] };
        }
        res.json(setting || { key, value: null });
    } catch (err) {
        console.error('Error fetching setting:', err);
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        let setting = await Setting.findOne({ key });
        if (!setting) {
            setting = new Setting({ key, value });
        } else {
            setting.value = value;
        }
        await setting.save();
        res.json({ success: true, data: setting });
    } catch (err) {
        console.error('Error updating setting:', err);
        res.status(500).json({ error: 'Failed to update setting' });
    }
};

const getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.find();
        // Merge with defaults
        const result = { ...DEFAULTS };
        settings.forEach(s => { result[s.key] = s.value; });
        res.json(result);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

module.exports = { getSetting, updateSetting, getAllSettings };
