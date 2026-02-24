import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing lat or lon parameters' }, { status: 400 });
    }

    try {
        // Calling Nominatim from the server-side to avoid CORS issues
        // Nominatim requires a valid User-Agent
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching location:', error);
        return NextResponse.json(
            { error: 'Failed to fetch location data' },
            { status: 500 }
        );
    }
}
