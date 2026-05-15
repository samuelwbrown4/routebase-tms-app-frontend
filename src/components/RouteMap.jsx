import { MapContainer, TileLayer, Marker, Popup , Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import finishIcon from '../assets/checkered-flag.svg'
import truckIcon from '../assets/truck-trailer.svg'
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet's default icon breaks in Vite/webpack — this fixes it


const originIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]    // where popup opens relative to icon
});

const inTransitIcon = L.icon({
  iconUrl: truckIcon,
  iconSize: [32, 32],
  iconAnchor: [3, 25],
  popupAnchor: [1, -34]    // where popup opens relative to icon
});

const destIcon = L.icon({
  iconUrl: finishIcon,
  iconSize: [32, 32],       // width, height in pixels
  iconAnchor: [6, 33],     // point of icon that sits on the coordinate
  popupAnchor: [0, -32]     // where popup opens relative to icon
});



const shipments = [
    { id: 1, origin: [32.7765, -79.9311], destination: [33.4489, -80.4718] },
    { id: 2, origin: [34.0007, -81.0348], destination: [35.2271, -80.8431] },
];




export default function RouteMap({displayedShipment}) {
    return (

        <MapContainer center={[39.5, -98.35]} zoom={5} style={{ height: '500px', width: '75%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            
            {displayedShipment?.route_geometry && (
                <>
                    <Polyline
                        positions={displayedShipment.route_geometry}
                        color="blue"
                    />
                    <Marker position={displayedShipment.route_geometry[0]} icon={originIcon}>
                        <Popup>Origin</Popup>
                    </Marker>
                    {displayedShipment.status === 'in_transit' && displayedShipment.current_position && (<Marker position={displayedShipment.current_position} icon={inTransitIcon}>
                        <Popup>Origin</Popup>
                    </Marker>)}
                    <Marker position={displayedShipment.route_geometry[displayedShipment.route_geometry.length - 1]} icon={destIcon}>
                        <Popup>Destination</Popup>
                    </Marker>
                </>
            )}
        </MapContainer>
    );
}