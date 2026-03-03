const crypto = require('crypto');

/**
 * Generate a unique tracking token in format MOB-YYYY-XXXX
 * where YYYY is the current year and XXXX is a 4-character alphanumeric code
 */
const generateTrackingToken = () => {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars (0,O,1,I)
    let code = '';
    const bytes = crypto.randomBytes(4);
    for (let i = 0; i < 4; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return `MOB-${year}-${code}`;
};

module.exports = { generateTrackingToken };
