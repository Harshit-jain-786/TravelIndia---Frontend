import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

function FitBounds({ fromCoords, toCoords }) {
    const map = useMap();
    useEffect(() => {
        if (fromCoords && toCoords) {
            map.fitBounds([fromCoords, toCoords], { padding: [40, 40] });
        }
    }, [fromCoords, toCoords, map]);
    return null;
}

export default function FlightMap({ fromCoords, toCoords, fromName, toName }) {
    const validCoords = arr => Array.isArray(arr) && arr.length === 2 && arr.every(Number.isFinite);
    if (!validCoords(fromCoords) || !validCoords(toCoords)) {
        return <div className="bg-red-100 text-red-700 p-4 rounded">Map cannot be loaded: invalid coordinates.</div>;
    }

    // Haversine formula for distance in km
    function getDistanceKm([lat1, lon1], [lat2, lon2]) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    const distanceKm = getDistanceKm(fromCoords, toCoords);

    return (
        <div style={{ width: 400, height: 400, margin: '0 auto', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001', position: 'relative', zIndex: 0 }}>
            <MapContainer bounds={[fromCoords, toCoords]} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <FitBounds fromCoords={fromCoords} toCoords={toCoords} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={fromCoords}>
                    <Popup>{fromName || "Departure"}</Popup>
                </Marker>
                <Marker position={toCoords}>
                    <Popup>{toName || "Arrival"}</Popup>
                </Marker>
                <Polyline positions={[fromCoords, toCoords]} color="blue" />
            </MapContainer>
            <div style={{ textAlign: 'center', marginTop: 8, fontWeight: 500, color: '#2563eb' }}>
                Distance: {distanceKm.toFixed(2)} km
            </div>
        </div>
    );
}
