const getLocation = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon parameters' });
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
                headers: {
                    'User-Agent': 'MobitelApp/1.0 (contact@mobitel.in)',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Nominatim API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching location:', error);
        return res.status(500).json({ error: 'Failed to fetch location data' });
    }
};

module.exports = {
    getLocation,
};
