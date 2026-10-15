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
        let shopName = req.body.shopName || '';
        let shopAddress = req.body.shopAddress || '';
        let shopContact = req.body.shopContact || '';

        if (req.body.shopId && (!shopName || !shopAddress)) {
            try {
                const Shop = require('../models/Shop');
                const shop = await Shop.findById(req.body.shopId);
                if (shop) {
                    shopName = shop.name || shopName;
                    shopAddress = shop.address || shopAddress;
                    shopContact = shop.contact || shopContact;
                }
            } catch (shopErr) {
                console.error('[Shop Lookup Warning in requests]', shopErr.message);
            }
        }

        const newRequest = new Request({
            ...req.body,
            shopName,
            shopAddress,
            shopContact
        });

        await newRequest.save();

        // -------------------------
        // Send email to customer
        // -------------------------
        const customerEmail = req.body.email;

        if (customerEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const shopInfoHtml = (shopName || shopAddress) ? `
                <div style="background: #fdf2f0; border-left: 4px solid #800000; padding: 12px; margin: 12px 0;">
                    <p style="margin: 2px 0; font-weight: bold; color: #800000;">🏪 Selected Store: ${shopName || 'Mobitel Service Center'}</p>
                    ${shopAddress ? `<p style="margin: 2px 0; font-size: 13px;">📍 ${shopAddress}</p>` : ''}
                    ${shopContact ? `<p style="margin: 2px 0; font-size: 13px;">📞 ${shopContact}</p>` : ''}
                </div>
            ` : '';

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: customerEmail,
                subject: 'Mobitel - Repair Request Received',
                html: `<h3>Thank you for choosing Mobitel, ${req.body.customerName || 'Customer'}!</h3>
                       <p>We have successfully received your repair request for your <b>${req.body.brand} ${req.body.model}</b>.</p>
                       <p><strong>Issue:</strong> ${req.body.issue || 'N/A'}<br>
                       <strong>Service Type:</strong> ${req.body.serviceType || 'Repair'}</p>
                       ${shopInfoHtml}
                       <p>Our team will review your request and a technician will contact you shortly.</p>
                       <p>Best regards,<br>The Mobitel Team</p>`
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`[Email] Customer repair receipt sent to ${customerEmail}`);
            } catch (mailErr) {
                console.error(`[Email Failed] Could not send receipt to ${customerEmail}`, mailErr);
            }

            // Also alert admin if configured
            if (process.env.ADMIN_EMAIL) {
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Request: ${req.body.brand} ${req.body.model} (${req.body.customerName})`,
                    html: `<h3>New Repair Request</h3>
                           <p><strong>Customer:</strong> ${req.body.customerName} (${req.body.phone})</p>
                           <p><strong>Device:</strong> ${req.body.brand} ${req.body.model}</p>
                           <p><strong>Service:</strong> ${req.body.serviceType}</p>
                           ${shopName ? `<p><strong>Shop:</strong> ${shopName}</p>` : ''}
                           ${req.body.address ? `<p><strong>Address:</strong> ${req.body.address}</p>` : ''}`
                }).catch(err => console.error('[Admin Email Error]', err));
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
