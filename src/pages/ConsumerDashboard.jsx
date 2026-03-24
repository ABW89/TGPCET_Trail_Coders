import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Users, MapPin, Clock, DollarSign, ShieldAlert, MessageCircle, Star } from 'lucide-react';
import ChatModal from '../components/ChatModal';
import FeedbackModal from '../components/FeedbackModal';

export default function ConsumerDashboard() {
  const { currentUser, jobs, addJob } = useAppContext();
  const [isPosting, setIsPosting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [targetName, setTargetName] = useState('Worker');

  // Filter jobs by current consumer
  const myPostings = jobs.filter(j => j.consumerId === currentUser.id);

  const handlePostJob = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newJob = {
      consumerId: currentUser.id,
      consumerName: currentUser.name || 'Anonymous User',
      skillNeeded: formData.get('skill'),
      wage: Number(formData.get('wage')),
      timing: formData.get('timing'),
      womenOnly: formData.get('womenOnly') === 'on',
      distance: '0km (Here)',
      urgency: formData.get('urgency'),
      location: currentUser.location
    };
    addJob(newJob);
    setIsPosting(false);
  };

  return (
    <div className="flex-col gap-6 w-full animate-fade-in pb-8">
       <div className="flex justify-between items-center mb-2">
         <h3>My Postings</h3>
         {!isPosting && (
           <button className="btn btn-primary" style={{padding: '0.4rem 1rem'}} onClick={() => setIsPosting(true)}>
             <Plus size={18} /> Post Job
           </button>
         )}
       </div>

       {isPosting ? (
         <div className="card border-secondary animate-fade-in">
           <h4 className="mb-4">New Request</h4>
           <form onSubmit={handlePostJob} className="flex-col gap-4">
             <div className="input-group">
               <label className="input-label">Skill Needed</label>
               <select name="skill" className="input-field" required>
                 <option value="">Select skill...</option>
                 <option value="Plumber">Plumber</option>
                 <option value="Electrician">Electrician</option>
                 <option value="Painter">Painter</option>
                 <option value="Mazdoor">Mazdoor</option>
               </select>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="input-group">
                 <label className="input-label">Estimated Wage (₹)</label>
                 <input type="number" name="wage" className="input-field" placeholder="e.g. 500" required />
               </div>
               <div className="input-group">
                 <label className="input-label">Urgency</label>
                 <select name="urgency" className="input-field" required>
                   <option value="medium">Normal</option>
                   <option value="high">Urgent!</option>
                 </select>
               </div>
             </div>

             <div className="input-group">
                <label className="input-label">Timing</label>
                <input type="text" name="timing" className="input-field" placeholder="Immediate, Today 3 PM..." required />
             </div>

             <div className="flex items-center gap-2 mt-2">
               <input type="checkbox" name="womenOnly" id="womenOnly" style={{width: 18, height: 18}} />
               <label htmlFor="womenOnly" className="text-muted" style={{fontSize: '0.875rem'}}>Request Women Workers Only (Privacy)</label>
             </div>

             <div className="flex gap-4 mt-4">
               <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setIsPosting(false)}>Cancel</button>
               <button type="submit" className="btn btn-primary" style={{flex: 1}}>Post Job</button>
             </div>
           </form>
         </div>
       ) : (
         <div className="flex-col gap-4">
           {myPostings.length === 0 ? (
             <div className="card text-center p-8">
               <Users size={32} className="text-muted mx-auto mb-4" />
               <p className="text-muted">You have no active gig postings.</p>
             </div>
           ) : (
             myPostings.map(job => (
               <div key={job.id} className="card flex-col gap-3 relative">
                 <div className="flex justify-between items-center pr-8">
                   <h4 className="m-0 text-primary">{job.skillNeeded}</h4>
                   <div className="badge">{job.status}</div>
                 </div>
                 
                 {(job.status === 'active' || job.status === 'on-way') && (
                     <button 
                       className="absolute top-4 right-4 text-primary bg-[rgba(79,70,229,0.1)] p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all border-none"
                       onClick={() => { setTargetName('Worker'); setChatOpen(true); }}
                     >
                       <MessageCircle size={20} />
                     </button>
                 )}

                 <div className="flex gap-4 text-muted" style={{fontSize: '0.875rem'}}>
                   <span className="flex items-center gap-1"><DollarSign size={14}/> ₹{job.wage}</span>
                   <span className="flex items-center gap-1"><Clock size={14}/> {job.timing}</span>
                 </div>
                 
                 {job.status === 'active' || job.status === 'on-way' ? (
                   <div className="mt-2 p-3 glass" style={{borderRadius: 'var(--radius-md)'}}>
                     <p className="text-secondary font-bold mb-1 flex items-center gap-2">
                       Worker Assigned!
                     </p>
                     <p className="text-muted text-sm" style={{fontSize: '0.875rem'}}>Status: {job.status.replace('-', ' ')}</p>
                     {job.status === 'on-way' && (
                        <button className="btn btn-secondary w-full mt-3 py-2 border-none" onClick={() => { setTargetName('Assigned Worker'); setFeedbackOpen(true); }}>
                           <Star size={16} /> Rate & Pay
                        </button>
                     )}
                   </div>
                 ) : job.status === 'completed' ? (
                    <div className="mt-2 text-secondary flex items-center gap-1" style={{fontSize: '0.875rem'}}>
                      <ShieldAlert size={14}/> Completed
                    </div>
                 ) : (
                    <div className="mt-2 text-muted" style={{fontSize: '0.875rem'}}>
                      Waiting for a worker to accept...
                    </div>
                 )}
               </div>
             ))
           )}
         </div>
       )}
       
       <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} contactName={targetName} />
       <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} targetName={targetName} />
    </div>
  );
}
