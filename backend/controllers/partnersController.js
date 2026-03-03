const Partner = require('../models/Partner');
const nodemailer = require('nodemailer');

// Helper to generate a random alphanumeric password
const generatePassword = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
};

// Retrieve all delivery partners
const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (err) {
        console.error("Error reading partners data from MongoDB:", err);
        res.status(500).json({ error: 'Failed to read partners data' });
    }
};

// Create a new delivery partner and email credentials
const addPartner = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if email already exists
        const existingPartner = await Partner.findOne({ email });
        if (existingPartner) {
            return res.status(400).json({ error: 'A partner with this email already exists' });
        }

        const password = generatePassword();

        const newPartner = new Partner({
            name,
            email,
            password, // Storing plaintext for demo/emailing purposes. In real app, hash this.
            status: 'active'
        });

        await newPartner.save();

        // Setup Nodemailer transport
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mobitel - Delivery Partner Account Created',
                text: `Hello ${name},\n\nYour Mobitel delivery partner account has been created successfully!\n\nHere are your login credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease login to the delivery portal to start receiving orders.\n\nBest,\nMobitel Admin`,
                html: `<h3>Welcome to Mobitel, ${name}!</h3>
                       <p>Your delivery partner account has been created.</p>
                       <p><strong>Login Email:</strong> ${email}<br>
                       <strong>Password:</strong> ${password}</p>
                       <p>Please login to the delivery portal to start receiving tasks.</p>`
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`[Email] Partner credentials sent to ${email}`);
            } catch (mailErr) {
                console.error(`[Email Failed] Could not send to ${email}`, mailErr);
                return res.status(201).json({
                    success: true,
                    warning: 'Partner created but email failed to send (check .env config).',
                    data: newPartner
                });
            }
        } else {
            console.log(`[Email Skipped] EMAIL_USER or EMAIL_PASS not set in .env. Password generated: ${password}`);
        }

        res.status(201).json({ success: true, data: newPartner });
    } catch (err) {
        console.error("Error creating delivery partner in MongoDB:", err);
        res.status(500).json({ error: 'Failed to create delivery partner' });
    }
};

module.exports = { getPartners, addPartner };
