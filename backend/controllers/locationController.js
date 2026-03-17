const getLocation = async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon parameters' });
    }

    if (!apiKey) {
        console.error('GOOGLE_MAPS_API_KEY is missing in .env');
        return res.status(500).json({ error: 'Location service misconfigured' });
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Google API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            // Return specific fields to maintain compatibility with frontend
            return res.json({
                display_name: data.results[0].formatted_address,
                results: data.results
            });
        } else if (data.status === 'ZERO_RESULTS') {
            return res.status(404).json({ error: 'No address found for these coordinates' });
        } else {
            throw new Error(`Google API error: ${data.status} ${data.error_message || ''}`);
        }
    } catch (error) {
        console.error('Error fetching location from Google:', error);
        return res.status(500).json({ error: 'Failed to fetch location data' });
    }
};

module.exports = {
    getLocation,
};
