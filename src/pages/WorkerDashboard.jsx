import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Navigation, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../components/ChatModal';
import FeedbackModal from '../components/FeedbackModal';

export default function WorkerDashboard() {
  const { currentUser, jobs, applyForJob, updateJobStatus } = useAppContext();
  const [chatOpen, setChatOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [targetName, setTargetName] = useState('');
  const navigate = useNavigate();

  const openJobs = jobs.filter(j => j.status === 'open');
  const myJob = jobs.find(j => j.workerId === currentUser.id && (j.status === 'active' || j.status === 'on-way'));

  const handleComplete = (job) => {
    updateJobStatus(job.id, 'completed');
    setTargetName(job.consumerName);
    setFeedbackOpen(true);
  };

  const handleAcceptJob = (jobId) => {
    applyForJob(jobId);
    navigate('/map');
  };

  return (
    <div className="flex-col gap-6 w-full animate-fade-in pb-8">
      {/* Worker Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center p-4">
          <div className="text-secondary" style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{currentUser.rozgarCredit}</div>
          <div className="text-muted" style={{fontSize: '0.75rem'}}>Rozgar-Credit</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-primary" style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{currentUser.rating} ★</div>
          <div className="text-muted" style={{fontSize: '0.75rem'}}>Rating</div>
        </div>
      </div>

      {myJob ? (
        <div className="card border border-primary relative shadow-lg" style={{backgroundColor: 'var(--surface-light)'}}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-primary pr-8">Current Job</h3>
            <div className="badge badge-verified capitalize">{myJob.status.replace('-', ' ')}</div>
          </div>
          <button 
             className="absolute top-4 right-4 text-primary bg-[rgba(79,70,229,0.1)] p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all border-none"
             onClick={() => { setTargetName(myJob.consumerName); setChatOpen(true); }}
          >
             <MessageCircle size={20} />
          </button>
          
          <h4 className="mb-1">{myJob.skillNeeded} needed by {myJob.consumerName}</h4>
          <div className="text-muted flex items-start gap-1 mb-4" style={{fontSize: '0.875rem'}}>
            <MapPin size={14} className="mt-1 flex-shrink-0" /> 
            <span>Address: <b>{myJob.detailedAddress || myJob.consumerName + "'s standard location"}</b> <br/>({myJob.distance} away)</span>
          </div>
          <div className="flex justify-between items-center mb-6 p-3 glass" style={{borderRadius: 'var(--radius-md)'}}>
            <span className="text-muted">Estimated Wage</span>
            <span className="text-secondary" style={{fontWeight: 'bold', fontSize: '1.25rem'}}>₹{myJob.wage}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {myJob.status === 'active' && (
              <button className="btn btn-outline" onClick={() => updateJobStatus(myJob.id, 'on-way')}>
                <Navigation size={18} /> On My Way
              </button>
            )}
            {myJob.status === 'on-way' && (
              <button className="btn btn-primary" onClick={() => handleComplete(myJob)}>
                <CheckCircle size={18} /> Mark Done
              </button>
            )}
            <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white" onClick={() => navigate('/map')}>
              <MapPin size={18} /> Map & ETA
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="mb-2">Available Gigs Nearby</h3>
          <div className="flex-col gap-4">
            {openJobs.length === 0 ? (
              <p className="text-muted text-center py-8">No gigs available right now. We will notify you when someone posts a job.</p>
            ) : (
               openJobs.map(job => (
                <div key={job.id} className="card hover:border-secondary transition-all" style={{padding: '1rem'}}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="mb-1">{job.skillNeeded}</h4>
                      <p className="text-muted" style={{fontSize:'0.75rem'}}>{job.consumerName}</p>
                    </div>
                    {job.urgency === 'high' && (
                      <span className="badge" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)'}}>
                        <AlertCircle size={12} className="mr-1"/> Urgent
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                     <span className="text-muted flex items-center gap-1" style={{fontSize: '0.875rem'}}>
                      <MapPin size={14} /> {job.distance}
                     </span>
                     <span className="text-muted flex items-center gap-1" style={{fontSize: '0.875rem'}}>
                      <Clock size={14} /> {job.timing}
                     </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-secondary" style={{fontWeight: 'bold'}}>₹{job.wage}</span>
                    <button className="btn btn-primary py-2 px-4" onClick={() => handleAcceptJob(job.id)}>Accept Job</button>
                  </div>
                </div>
               ))
            )}
          </div>
        </>
      )}

      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} contactName={targetName} />
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} targetName={targetName} isWorker={true} />
    </div>
  );
}
