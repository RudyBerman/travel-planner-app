import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],     // size of the icon
    iconAnchor: [12, 41],   // point of the icon which will correspond to marker's location
    popupAnchor: [0, -41]   // point from which the popup should open relative to the iconAnchor
});

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
    const [selectedMarker, setSelectedMarker] = useState(null);

    const [note, setNote] = useState({
        name: '',
        description: '',
        cost: 0
      });
      
      const handleNoteChange = (e) => {
        const { name, value } = e.target;
        setNote((prevNote) => ({
          ...prevNote,
          [name]: value
        }));
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
            setNote({
                name: '',
                description: '',
                cost: 0
            });;
        }
    };

    const handleMarkerClick = (index) => {
        setSelectedMarker(index);
        setNote(markers[index].note);
    };

    const handleRemoveMarker = (indexToRemove) => {
        setMarkers((prevMarkers) => {
            const updatedMarkers = prevMarkers.filter((_, index) => index !== indexToRemove);
            if (updatedMarkers.length === 0) {
                localStorage.removeItem("markers"); // Clear from localStorage if no markers left
            }
            return updatedMarkers;
        });
    };

    // Save markers to localStorage when they change
    useEffect(() => {
        if (markers.length > 0) {
            localStorage.setItem("markers", JSON.stringify(markers));
        } 
    }, [markers]);

    // Load markers from localStorage
    useEffect(() => {
        const savedMarkers = localStorage.getItem("markers");
        if (savedMarkers) {
            try {
                const parsedMarkers = JSON.parse(savedMarkers);
                // Validate that markers have required properties
                const validMarkers = parsedMarkers.filter(marker => 
                    marker && 
                    typeof marker.lat === 'number' && 
                    typeof marker.lng === 'number'
                );
                setMarkers(validMarkers);
            } catch (error) {
                console.error("Error loading markers:", error);
                localStorage.removeItem("markers"); // Clear invalid data
                setMarkers([]);
            }
        }
    }, []);

    const addMarker = (position) => {
        const newMarker = {
          lat: position.lat,
          lng: position.lng,
          note: {
            name: note.name,
            description: note.description,
            cost: note.cost
          }
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      };
      

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "70%", width: "100%" }}
            >
                {/* Dark matter */}
                {/* <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                /> */}
                {/* Positron */}
                <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                />

                <MapEvents onMapClick={addMarker} />
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lng]}
                        icon={defaultIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(index),
                        }}
                    >
                    <Popup>
                        <div>
                            <h3>{marker.note.name}</h3>
                            <p>{marker.note.description}</p>
                            <p><strong>Cost: </strong>${marker.note.cost}</p>
                            <button onClick={(e) => {
                                e.stopPropagation(); 
                                handleRemoveMarker(index);
                            }}>
                                Remove
                            </button>
                        </div>
                    </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {selectedMarker !== null && (
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Location Name"
                        value={note.name}
                        onChange={handleNoteChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={note.description}
                        onChange={handleNoteChange}
                    />
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={note.cost}
                        onChange={handleNoteChange}
                    />

                    <button onClick={handleSaveNote}>Save Note</button>
                </div>
            )}
        </div>
    );
};

export default Map;
