const nodemailer = require('nodemailer');
const NotificationLog = require('../models/NotificationLog');

// ─── Email Transport ───
let transporter = null;
const getTransporter = () => {
    if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return transporter;
};

// ─── Send Email ───
const sendEmail = async (to, subject, html) => {
    const transport = getTransporter();
    if (!transport) {
        console.warn('[Notification] Email not configured (EMAIL_USER/EMAIL_PASS missing)');
        return false;
    }

    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        console.log(`[Email] Sent to ${to}: ${subject}`);
        return true;
    } catch (err) {
        console.error(`[Email Failed] ${to}: ${err.message}`);
        return false;
    }
};

// ─── Send WhatsApp (Stubbed — plug in Twilio/Meta API) ───
const sendWhatsApp = async (to, message) => {
    // TODO: Integrate with Twilio WhatsApp API or Meta Cloud API
    // For now, log to console as a placeholder
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
        try {
            const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await twilio.messages.create({
                body: message,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
                to: `whatsapp:${to}`
            });
            console.log(`[WhatsApp] Sent successfully to ${to}`);
            return true;
        } catch (err) {
            console.error(`[WhatsApp Failed] ${to}: ${err.message}`);
            return false;
        }
    }
    console.log(`[WhatsApp Stub] (Twilio keys missing) Would send to ${to}: ${message}`);
    return false;
};

// ─── Log notification ───
const logNotification = async (bookingId, channel, recipient, event, success, error = '') => {
    try {
        await NotificationLog.create({
            bookingId,
            channel,
            recipient,
            event,
            status: success ? 'sent' : 'failed',
            error
        });
    } catch (err) {
        console.error('[NotificationLog] Failed to log:', err.message);
    }
};

// ─── High-level notification functions ───

const notifyNewBooking = async (booking) => {
    const { trackingToken, customerName, brand, model, serviceType, email, phone, shopId } = booking;
    
    let shopName = booking.shopName || '';
    let shopAddress = booking.shopAddress || '';
    let shopContact = booking.shopContact || '';

    const isShopVisit = booking.address === 'Shop Visit' || !!shopId || !!shopName;

    if (shopId && (!shopName || !shopAddress)) {
        try {
            const Shop = require('../models/Shop');
            const shop = await Shop.findById(shopId);
            if (shop) {
                shopName = shop.name || shopName;
                shopAddress = shop.address || shopAddress;
                shopContact = shop.contact || shopContact;
            }
        } catch (err) {
            console.error("Failed to fetch shop details in notifyNewBooking:", err.message);
        }
    }

    let shopDetailsHtml = '';
    let shopDetailsText = '';

    if (isShopVisit && (shopName || shopAddress)) {
        shopDetailsHtml = `
            <div style="background: #fdf2f0; border: 1px solid #fecaca; border-left: 4px solid #800000; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin-top:0; color:#800000; font-size: 16px;">🏪 Selected Store / Drop-off Location</h3>
                <p style="margin: 4px 0; font-size: 15px; font-weight: bold; color: #111;">${shopName || 'Mobitel Service Center'}</p>
                ${shopAddress ? `<p style="margin: 4px 0; font-size: 13px; color: #444;">📍 <strong>Address:</strong> ${shopAddress}</p>` : ''}
                ${shopContact ? `<p style="margin: 4px 0; font-size: 13px; color: #444;">📞 <strong>Phone:</strong> ${shopContact}</p>` : ''}
            </div>
        `;
        shopDetailsText = `\n\n🏪 Selected Store: ${shopName || 'Mobitel Store'}${shopAddress ? `\n📍 Address: ${shopAddress}` : ''}${shopContact ? `\n📞 Phone: ${shopContact}` : ''}`;
    } else if (booking.address && booking.address !== 'Shop Visit') {
        shopDetailsHtml = `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <h3 style="margin-top:0; color:#1e40af; font-size: 16px;">🏠 Home Service Delivery Address</h3>
                <p style="margin: 4px 0; font-size: 14px; color: #1e293b;">${booking.address}</p>
                ${booking.landmark ? `<p style="margin: 4px 0; font-size: 13px; color: #475569;"><strong>Landmark:</strong> ${booking.landmark}</p>` : ''}
                ${booking.pincode ? `<p style="margin: 4px 0; font-size: 13px; color: #475569;"><strong>Pincode:</strong> ${booking.pincode}</p>` : ''}
            </div>
        `;
        shopDetailsText = `\n\n🏠 Home Service Address: ${booking.address}${booking.landmark ? ` (Landmark: ${booking.landmark})` : ''}${booking.pincode ? ` - ${booking.pincode}` : ''}`;
    }

    // Email to customer
    if (email) {
        const success = await sendEmail(email, 'Mobitel - Repair Booking Confirmed!', `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 6px;">Booking Confirmed! ✅</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Your repair request has been received successfully.</p>
                <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #eaeaea;">
                    <p style="margin: 6px 0;"><strong>Tracking Token:</strong> <code style="background: #800000; color: white; padding: 4px 12px; border-radius: 4px; font-size: 18px; font-weight: bold;">${trackingToken}</code></p>
                    <p style="margin: 6px 0;"><strong>Device:</strong> ${brand} ${model}</p>
                    <p style="margin: 6px 0;"><strong>Service:</strong> ${serviceType}</p>
                    <p style="margin: 6px 0;"><strong>Preferred Schedule:</strong> ${booking.preferredDate || 'N/A'} at ${booking.preferredTime || 'N/A'}</p>
                </div>
                ${shopDetailsHtml}
                <p>Use your tracking token to check repair status anytime at our website.</p>
                <p style="color: #666; margin-top: 20px;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'booking_created', success);
    }

    // WhatsApp to customer
    if (phone) {
        const msg = `✅ Mobitel Booking Confirmed!\n\nHi ${customerName}, your repair for ${brand} ${model} (${serviceType}) is confirmed.\n\nTracking Token: ${trackingToken}${shopDetailsText}\n\nTrack your repair anytime on our website.`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'booking_created', success);
    }

    // Email to admin
    if (process.env.ADMIN_EMAIL) {
        const visitTypeStr = isShopVisit ? '🏪 Shop Visit' : '🏠 Home Service';
        const adminShopHtml = isShopVisit ? `
            <div style="background: #fdf2f0; padding: 14px; border-radius: 8px; margin: 14px 0; border: 1px solid #fecaca;">
                <p style="margin: 2px 0; font-size: 14px;"><strong>Service Mode:</strong> <span style="color: #800000; font-weight: bold;">Shop Visit</span></p>
                <p style="margin: 2px 0; font-size: 15px;"><strong>Selected Shop:</strong> <span style="color: #800000; font-weight: bold;">${shopName || 'Store Selected (ID: ' + (booking.shopId || 'N/A') + ')'}</span></p>
                ${shopAddress ? `<p style="margin: 2px 0; font-size: 13px; color: #555;"><strong>Shop Address:</strong> ${shopAddress}</p>` : ''}
                ${shopContact ? `<p style="margin: 2px 0; font-size: 13px; color: #555;"><strong>Shop Contact:</strong> ${shopContact}</p>` : ''}
            </div>
        ` : `
            <div style="background: #eff6ff; padding: 14px; border-radius: 8px; margin: 14px 0; border: 1px solid #bfdbfe;">
                <p style="margin: 2px 0; font-size: 14px;"><strong>Service Mode:</strong> <span style="color: #1e40af; font-weight: bold;">Home Service</span></p>
                <p style="margin: 2px 0; font-size: 13px;"><strong>Customer Address:</strong> ${booking.address || 'N/A'}</p>
                ${booking.landmark ? `<p style="margin: 2px 0; font-size: 13px;"><strong>Landmark:</strong> ${booking.landmark}</p>` : ''}
                ${booking.pincode ? `<p style="margin: 2px 0; font-size: 13px;"><strong>Pincode:</strong> ${booking.pincode}</p>` : ''}
            </div>
        `;

        const success = await sendEmail(process.env.ADMIN_EMAIL, `New Booking [${visitTypeStr}]: ${trackingToken} - ${brand} ${model}`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
                <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 6px; margin-top: 0;">New Repair Booking Received</h2>
                <p style="font-size: 15px; margin: 10px 0;"><strong>Tracking Token:</strong> <code style="background: #800000; color: white; padding: 3px 8px; border-radius: 4px; font-size: 16px; font-weight: bold;">${trackingToken}</code></p>
                
                <div style="background: #f8f8f8; padding: 14px; border-radius: 8px; margin: 12px 0; border: 1px solid #eaeaea;">
                    <h4 style="margin: 0 0 6px 0; color: #333;">Customer Information</h4>
                    <p style="margin: 3px 0;"><strong>Name:</strong> ${customerName}</p>
                    <p style="margin: 3px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #800000; font-weight: bold;">${phone}</a></p>
                    <p style="margin: 3px 0;"><strong>Email:</strong> ${email || 'N/A'}</p>
                </div>

                <div style="background: #f8f8f8; padding: 14px; border-radius: 8px; margin: 12px 0; border: 1px solid #eaeaea;">
                    <h4 style="margin: 0 0 6px 0; color: #333;">Device & Booking Details</h4>
                    <p style="margin: 3px 0;"><strong>Device:</strong> ${brand} ${model}</p>
                    <p style="margin: 3px 0;"><strong>Service:</strong> ${serviceType}</p>
                    <p style="margin: 3px 0;"><strong>Issue:</strong> ${booking.issue || 'N/A'}</p>
                    <p style="margin: 3px 0;"><strong>Preferred Schedule:</strong> ${booking.preferredDate || 'N/A'} at ${booking.preferredTime || 'N/A'}</p>
                    <p style="margin: 3px 0;"><strong>Payment:</strong> ${booking.payment_mode || 'N/A'} (Amount: ₹${booking.total_amount || 0})</p>
                </div>

                ${adminShopHtml}

                <p style="font-size: 12px; color: #888; margin-top: 16px;">This notification was automatically sent by the Mobitel system.</p>
            </div>
        `);
        await logNotification(booking._id, 'email', process.env.ADMIN_EMAIL, 'booking_created_admin', success);
    }

    // WhatsApp to admin
    if (process.env.ADMIN_WHATSAPP) {
        const locationSummary = isShopVisit 
            ? `Store: ${shopName || 'Shop Visit'}` 
            : `Address: ${booking.address || 'Home Service'}`;
        const msg = `🔔 New Booking: ${trackingToken}\nCustomer: ${customerName} (${phone})\nDevice: ${brand} ${model}\nService: ${serviceType}\n${locationSummary}\nTime: ${booking.preferredDate} ${booking.preferredTime}`;
        const success = await sendWhatsApp(process.env.ADMIN_WHATSAPP, msg);
        await logNotification(booking._id, 'whatsapp', process.env.ADMIN_WHATSAPP, 'booking_created_admin', success);
    }
};

const notifyStatusChange = async (booking, newStatus) => {
    const { trackingToken, customerName, brand, model, email, phone } = booking;

    if (email) {
        const success = await sendEmail(email, `Mobitel - Repair Status Update: ${newStatus}`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800000;">Status Update 🔄</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Your repair for <strong>${brand} ${model}</strong> has been updated.</p>
                <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Tracking Token:</strong> ${trackingToken}</p>
                    <p style="margin: 4px 0;"><strong>New Status:</strong> <span style="color: #800000; font-weight: bold;">${newStatus}</span></p>
                </div>
                <p>Track your repair anytime using your tracking token on our website.</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'status_changed', success);
    }

    if (phone) {
        const msg = `🔄 Mobitel Repair Update\n\nHi ${customerName}, your ${brand} ${model} repair status:\n\n📌 ${newStatus}\n\nToken: ${trackingToken}`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'status_changed', success);
    }
};

const notifyJobCompleted = async (booking) => {
    const { trackingToken, customerName, brand, model, email, phone } = booking;

    if (email) {
        const success = await sendEmail(email, `Mobitel - Your ${brand} ${model} is Ready! 🎉`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800000;">Repair Completed! 🎉</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Great news! Your <strong>${brand} ${model}</strong> repair is complete and ready for pickup.</p>
                <div style="background: #f0fff0; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #cfc;">
                    <p style="margin: 4px 0;"><strong>Tracking Token:</strong> ${trackingToken}</p>
                    <p style="margin: 4px 0;"><strong>Status:</strong> ✅ Completed</p>
                </div>
                <p>Please collect your device at your earliest convenience.</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'job_completed', success);
    }

    if (phone) {
        const msg = `🎉 Repair Complete!\n\nHi ${customerName}, your ${brand} ${model} is repaired and ready for pickup!\n\nToken: ${trackingToken}`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'job_completed', success);
    }

    // Admin notification
    if (process.env.ADMIN_EMAIL) {
        const success = await sendEmail(process.env.ADMIN_EMAIL, `Job Completed: ${trackingToken}`, `
            <h3>Repair Job Completed ✅</h3>
            <p><strong>Token:</strong> ${trackingToken}</p>
            <p><strong>Customer:</strong> ${customerName} (${phone})</p>
            <p><strong>Device:</strong> ${brand} ${model}</p>
        `);
        await logNotification(booking._id, 'email', process.env.ADMIN_EMAIL, 'job_completed_admin', success);
    }
};

const notifyReadyForPickup = async (booking) => {
    const { trackingToken, customerName, brand, model, email, phone, shopName, shopAddress, shopContact } = booking;

    const shopInfoHtml = (shopName || shopAddress) ? `
        <div style="background: #fdf2f0; padding: 14px; border-radius: 8px; margin: 14px 0; border: 1px solid #fecaca;">
            <p style="margin: 2px 0; font-size: 14px; font-weight: bold; color: #800000;">🏪 Pickup Store: ${shopName || 'Mobitel Service Center'}</p>
            ${shopAddress ? `<p style="margin: 4px 0; font-size: 13px; color: #555;">📍 Address: ${shopAddress}</p>` : ''}
            ${shopContact ? `<p style="margin: 4px 0; font-size: 13px; color: #555;">📞 Phone: ${shopContact}</p>` : ''}
        </div>
    ` : '<p>Please visit our shop at your earliest convenience.</p>';

    if (email) {
        const success = await sendEmail(email, `Mobitel - Your ${brand} ${model} is Ready for Pickup!`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 6px;">Ready for Pickup! 📦</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Your <strong>${brand} ${model}</strong> (Token: <code>${trackingToken}</code>) is ready for pickup.</p>
                ${shopInfoHtml}
                <p style="color: #666; margin-top: 16px;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'ready_for_pickup', success);
    }

    if (phone) {
        const storeText = shopName ? ` at ${shopName}` : '';
        const msg = `📦 Ready for Pickup!\n\nHi ${customerName}, your ${brand} ${model} is ready! Please visit us${storeText} to collect it.\n\nToken: ${trackingToken}`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'ready_for_pickup', success);
    }
};

const notifyPaymentSuccess = async (booking) => {
    const { trackingToken, customerName, brand, model, amount_paid_online, payment_mode, email, phone } = booking;
    const isAdvance = payment_mode === 'online_advance';
    const amountStr = `₹${amount_paid_online}`;

    if (email) {
        const success = await sendEmail(email, `Mobitel - Payment Received for ${brand} ${model}`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Payment Successful ✅</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>We've successfully received your ${isAdvance ? 'advance ' : ''}payment of <strong>${amountStr}</strong>.</p>
                <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Tracking Token:</strong> ${trackingToken}</p>
                    <p style="margin: 4px 0;"><strong>Device:</strong> ${brand} ${model}</p>
                    <p style="margin: 4px 0;"><strong>Amount Paid:</strong> <span style="color: #28a745; font-weight: bold;">${amountStr}</span></p>
                    ${isAdvance ? `<p style="margin: 4px 0;"><strong>Amount Due at Store:</strong> ₹${booking.amount_due}</p>` : ''}
                </div>
                <p>Thank you for choosing Mobitel!</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'payment_success', success);
    }

    if (phone) {
        const msg = `✅ Payment Received\n\nHi ${customerName}, we received your ${isAdvance ? 'advance ' : ''}payment of ${amountStr} for your ${brand} ${model} repair.\n${isAdvance ? `\nAmount Due at Store: ₹${booking.amount_due}\n` : ''}\nToken: ${trackingToken}`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'payment_success', success);
    }
};

const notifyRefundInitiated = async (booking) => {
    const { trackingToken, customerName, refund_amount, email, phone } = booking;

    if (email) {
        const success = await sendEmail(email, `Mobitel - Refund Initiated`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #17a2b8;">Refund Initiated 🔄</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>A refund of <strong>₹${refund_amount}</strong> has been initiated for your booking (${trackingToken}).</p>
                <p>Please note that it typically takes 5-7 business days for the amount to reflect in your original payment method depending on your bank.</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'refund_initiated', success);
    }

    if (phone) {
        const msg = `🔄 Refund Initiated\n\nHi ${customerName}, a refund of ₹${refund_amount} has been initiated for booking ${trackingToken}.\n\nIt may take 5-7 business days to reflect in your account.`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'refund_initiated', success);
    }
};

module.exports = {
    sendEmail,
    sendWhatsApp,
    notifyNewBooking,
    notifyStatusChange,
    notifyJobCompleted,
    notifyReadyForPickup,
    notifyPaymentSuccess,
    notifyRefundInitiated
};
