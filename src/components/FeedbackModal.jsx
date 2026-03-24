import { useState } from 'react';
import { X, Star, Ghost } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, targetName, isWorker }) {
  const [rating, setRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="card w-full max-w-md">
         <div className="flex justify-between items-center mb-4">
           <h3>Rate {targetName}</h3>
           <button onClick={onClose} className="btn border-none" style={{background: 'transparent', padding: '0.2rem'}}>
             <X size={20} className="text-muted" />
           </button>
         </div>
         
         <p className="text-muted mb-4">How was your experience?</p>
         
         <div className="flex justify-center gap-2 mb-6">
           {[1,2,3,4,5].map(star => (
             <Star 
               key={star} 
               size={32} 
               className={`cursor-pointer ${rating >= star ? 'text-warning fill-warning' : 'text-muted'}`}
               onClick={() => setRating(star)}
             />
           ))}
         </div>

         {/* Ghost Rate Feature */}
         <div className="p-4 mb-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
            <h4 className="flex items-center gap-2 text-danger mb-2">
              <Ghost size={18} /> Report Ghosting
            </h4>
            <p className="text-sm text-muted mb-3" style={{fontSize: '0.875rem'}}>
              Did they accept but never show up? Report them to adjust their Rozgar-Credit fair-play score.
            </p>
            <button className="btn btn-outline border-danger text-danger w-full hover:bg-danger hover:text-white" onClick={onClose}>
              Report No-Show
            </button>
         </div>

         <div className="input-group">
           <label className="input-label">Additional Comments</label>
           <textarea className="input-field" rows="3" placeholder="Any issues or compliments?"></textarea>
         </div>

         <button className="btn btn-primary w-full mt-4" onClick={onClose}>Submit Feedback</button>
      </div>
    </div>
  );
}
