import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Separate component for handling map clicks
// function MapEvents({ onMapClick }) {
const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onMapClick({ lat, lng });
        }
    });
    return null;
}

const Map = () => {
    const [markers, setMarkers] = useState([]);
    const [note, setNote] = useState("");
    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleSaveNote = () => {
        if (selectedMarker !== null) {
            const updatedMarkers = markers.map((marker, index) => {
                if (index === selectedMarker) {
                    return { ...marker, note };
                }
                return marker;
            });
            setMarkers(updatedMarkers);
            setSelectedMarker(null);
            setNote("");
        }
    };

    const handleMarkerClick = (index) => {
        setSelectedMarker(index);
        setNote(markers[index].note);
    };

    // Save markers to localStorage when they change
    useEffect(() => {
        localStorage.setItem("markers", JSON.stringify(markers));
    }, [markers]);

    // Load markers from localStorage when the app starts
    useEffect(() => {
        const savedMarkers = localStorage.getItem("markers");
        if (savedMarkers) {
            setMarkers(JSON.parse(savedMarkers));
        }
    }, []);

    const addMarker = (position) => {
        const newMarker = { ...position, note: "" };
        setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "70%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents onMapClick={addMarker} />
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lng]}
                        eventHandlers={{
                            click: () => handleMarkerClick(index),
                        }}
                    >
                        <Popup>{marker.note}</Popup>
                    </Marker>
                ))}
            </MapContainer>

            {selectedMarker !== null && (
                <div>
                    <textarea
                        value={note}
                        onChange={handleNoteChange}
                        placeholder="Add a note"
                    />
                    <button onClick={handleSaveNote}>Save Note</button>
                </div>
            )}
        </div>
    );
};

export default Map;
