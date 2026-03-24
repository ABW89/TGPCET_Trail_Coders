import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../context/AppContext';
import { Navigation, Clock } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapWidget() {
  const { jobs, currentUser } = useAppContext();
  
  const myJob = jobs.find(j => j.workerId === currentUser.id && (j.status === 'active' || j.status === 'on-way'));
  
  const workerLocation = [currentUser.location.lat, currentUser.location.lng];
  
  // Center defaults to worker, but if they have a job, focus between them.
  const jobLocation = myJob ? [myJob.location.lat, myJob.location.lng] : workerLocation;
  const mapCenter = myJob ? [(workerLocation[0] + jobLocation[0])/2, (workerLocation[1] + jobLocation[1])/2] : workerLocation;

  // Calculate mock ETA based on distance
  const calculateETA = (distanceStr) => {
    if (!distanceStr) return "15 mins";
    if (distanceStr.includes('150m')) return "3 mins walk";
    if (distanceStr.includes('km')) {
        const kms = parseFloat(distanceStr);
        return Math.ceil(kms * 4) + " mins by bike/auto"; // roughly 15 km/h avg city speed
    }
    return "12 mins away";
  };

  return (
    <div className="flex-col gap-4 w-full animate-fade-in pb-8 relative">
      <div className="flex justify-between items-center mb-2">
         <h3>Live Navigation</h3>
         <div className="badge badge-verified">GPS Active</div>
      </div>
      
      {myJob && (
        <div className="card w-full mb-4 border-primary shadow-lg p-4 animate-fade-in" style={{ backgroundColor: 'var(--surface-light)' }}>
          <h4 className="flex items-center gap-2 mb-2 text-primary">
            <Navigation size={18} /> Approaching Destination
          </h4>
          <p className="text-muted mb-1" style={{fontSize: '0.875rem'}}>
            <b className="text-white">Exact Address:</b> <br/>{myJob.detailedAddress || myJob.consumerName + "'s location"}
          </p>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
             <span className="flex items-center gap-1 text-warning font-bold">
               <Clock size={16} /> ETA: {calculateETA(myJob.distance)}
             </span>
             <span className="badge bg-primary text-white">Wage: ₹{myJob.wage}</span>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden relative border border-[rgba(255,255,255,0.1)]" style={{ height: '60vh', minHeight: '400px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
        <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%', zIndex: 10 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Worker's own location */}
          <Marker position={workerLocation}>
            <Popup>
              <b>You are here</b><br/>
              Ready for gigs.
            </Popup>
          </Marker>

          {/* Assigned Job Routing */}
          {myJob && (
             <>
               <Marker position={jobLocation}>
                 <Popup>
                   <b>Destination</b><br/>
                   {myJob.consumerName}'s request
                 </Popup>
               </Marker>
               {/* Draw Polyline representing route between Worker and Job */}
               <Polyline positions={[workerLocation, jobLocation]} color="#4F46E5" weight={5} dashArray="8, 12" />
             </>
          )}

          {/* Other Job Locations (if no active job or just showing map) */}
          {!myJob && jobs.filter(j => j.status === 'open').map(job => (
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
