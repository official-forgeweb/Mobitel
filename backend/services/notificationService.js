const nodemailer = require('nodemailer');
const NotificationLog = require('../models/NotificationLog');

// ─── Email Transport ───
let transporter = null;
const getTransporter = () => {
    if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
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
            // Placeholder for Twilio integration:
            // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            // await twilio.messages.create({
            //     body: message,
            //     from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
            //     to: `whatsapp:${to}`
            // });
            console.log(`[WhatsApp] Would send to ${to}: ${message}`);
            return true;
        } catch (err) {
            console.error(`[WhatsApp Failed] ${to}: ${err.message}`);
            return false;
        }
    }
    console.log(`[WhatsApp Stub] To ${to}: ${message}`);
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
    const { trackingToken, customerName, brand, model, serviceType, email, phone } = booking;

    // Email to customer
    if (email) {
        const success = await sendEmail(email, 'Mobitel - Repair Booking Confirmed!', `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800000;">Booking Confirmed! ✅</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Your repair request has been received successfully.</p>
                <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Tracking Token:</strong> <code style="background: #800000; color: white; padding: 4px 12px; border-radius: 4px; font-size: 18px; font-weight: bold;">${trackingToken}</code></p>
                    <p style="margin: 4px 0;"><strong>Device:</strong> ${brand} ${model}</p>
                    <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceType}</p>
                </div>
                <p>Use your tracking token to check repair status anytime at our website.</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'booking_created', success);
    }

    // WhatsApp to customer
    if (phone) {
        const msg = `✅ Mobitel Booking Confirmed!\n\nHi ${customerName}, your repair for ${brand} ${model} (${serviceType}) is confirmed.\n\nTracking Token: ${trackingToken}\n\nTrack your repair anytime on our website.`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'booking_created', success);
    }

    // Email to admin
    if (process.env.ADMIN_EMAIL) {
        const success = await sendEmail(process.env.ADMIN_EMAIL, `New Booking: ${trackingToken} - ${brand} ${model}`, `
            <h3>New Repair Booking Received</h3>
            <p><strong>Token:</strong> ${trackingToken}</p>
            <p><strong>Customer:</strong> ${customerName} (${phone})</p>
            <p><strong>Device:</strong> ${brand} ${model}</p>
            <p><strong>Service:</strong> ${serviceType}</p>
            <p><strong>Issue:</strong> ${booking.issue || 'N/A'}</p>
        `);
        await logNotification(booking._id, 'email', process.env.ADMIN_EMAIL, 'booking_created_admin', success);
    }

    // WhatsApp to admin
    if (process.env.ADMIN_WHATSAPP) {
        const msg = `🔔 New Booking: ${trackingToken}\nCustomer: ${customerName} (${phone})\nDevice: ${brand} ${model}\nService: ${serviceType}`;
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
    const { trackingToken, customerName, brand, model, email, phone } = booking;

    if (email) {
        const success = await sendEmail(email, `Mobitel - Your ${brand} ${model} is Ready for Pickup!`, `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800000;">Ready for Pickup! 📦</h2>
                <p>Hello <strong>${customerName}</strong>,</p>
                <p>Your <strong>${brand} ${model}</strong> is ready for pickup.</p>
                <p>Please visit our shop at your earliest convenience.</p>
                <p style="color: #666;">— The Mobitel Team</p>
            </div>
        `);
        await logNotification(booking._id, 'email', email, 'ready_for_pickup', success);
    }

    if (phone) {
        const msg = `📦 Ready for Pickup!\n\nHi ${customerName}, your ${brand} ${model} is ready! Please visit us to collect it.\n\nToken: ${trackingToken}`;
        const success = await sendWhatsApp(phone, msg);
        await logNotification(booking._id, 'whatsapp', phone, 'ready_for_pickup', success);
    }
};

module.exports = {
    sendEmail,
    sendWhatsApp,
    notifyNewBooking,
    notifyStatusChange,
    notifyJobCompleted,
    notifyReadyForPickup
};
