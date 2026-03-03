const Request = require('../models/Request');
const nodemailer = require('nodemailer');

const getRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error("Error fetching requests from MongoDB:", err);
        res.status(500).json({ error: 'Failed to read requests' });
    }
};

const addRequest = async (req, res) => {
    try {
        const newRequest = new Request({
            ...req.body
        });

        await newRequest.save();

        // -------------------------
        // Send email to customer
        // -------------------------
        const customerEmail = req.body.email; // Attempt to get customer email if passed in form

        // If the email was passed from frontend (Needs to be added later to the frontend form, checking optionally here)
        if (customerEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: customerEmail,
                subject: 'Mobitel - Repair Request Received',
                html: `<h3>Thank you for choosing Mobitel, ${req.body.customerName || 'Customer'}!</h3>
                       <p>We have successfully received your repair request for your <b>${req.body.brand} ${req.body.model}</b>.</p>
                       <p><strong>Issue:</strong> ${req.body.issue}<br>
                       <strong>Service Type:</strong> ${req.body.serviceType}</p>
                       <p>Our team will review your request and a technician will contact you shortly.</p>
                       <p>Best regards,<br>The Mobitel Team</p>`
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`[Email] Customer repair receipt sent to ${customerEmail}`);
            } catch (mailErr) {
                console.error(`[Email Failed] Could not send receipt to ${customerEmail}`, mailErr);
            }
        }

        res.status(201).json({ success: true, data: newRequest });
    } catch (err) {
        console.error("Error creating request in MongoDB:", err);
        res.status(500).json({ error: 'Failed to add request' });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Email Customer about Status Change
        if (updatedRequest.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: updatedRequest.email,
                subject: `Mobitel - Repair Status Update: ${status}`,
                html: `<h3>Hello ${updatedRequest.customerName || 'Customer'},</h3>
                       <p>We are writing to inform you that your repair request for the <b>${updatedRequest.brand} ${updatedRequest.model}</b> has been updated.</p>
                       <p><strong>New Status:</strong> ${status}</p>
                       <p>If you have any questions, feel free to contact us.</p>
                       <p>Best regards,<br>The Mobitel Team</p>`
            };

            transporter.sendMail(mailOptions).then(() => {
                console.log(`[Email] Status update sent to ${updatedRequest.email}`);
            }).catch(mailErr => {
                console.error(`[Email Failed] Could not send status update to ${updatedRequest.email}`, mailErr);
            });
        }

        res.json({ success: true, data: updatedRequest });
    } catch (err) {
        console.error("Error updating request status in MongoDB:", err);
        res.status(500).json({ error: 'Failed to update request status' });
    }
};

module.exports = { getRequests, addRequest, updateRequestStatus };
