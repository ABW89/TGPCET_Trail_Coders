import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../context/AppContext';
import L from 'leaflet';

// Fix for default leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapWidget() {
  const { jobs, currentUser } = useAppContext();
  
  // Center on worker's location
  const center = [currentUser.location.lat, currentUser.location.lng];

  return (
    <div className="flex-col gap-4 w-full animate-fade-in pb-8">
      <div className="flex justify-between items-center mb-2">
         <h3>Gig Map</h3>
         <div className="badge badge-verified">Live Tracking via GPS</div>
      </div>
      
      <div className="card p-0 overflow-hidden relative" style={{ height: '60vh', minHeight: '400px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 10 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Worker's own location */}
          <Marker position={center}>
            <Popup>
              <b>You are here</b><br/>
              Ready for gigs.
            </Popup>
          </Marker>

          {/* Job Locations */}
          {jobs.filter(j => j.status === 'open').map(job => (
             <Marker key={job.id} position={[job.location.lat, job.location.lng]}>
               <Popup>
                 <b>{job.skillNeeded}</b> needed!<br/>
                 Wage: ₹{job.wage}<br/>
                 Distance: {job.distance}
               </Popup>
             </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
