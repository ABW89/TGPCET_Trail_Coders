import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, ShieldCheck, MapPin, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  const [intro, setIntro] = useState('Passionate about my work.');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex-col gap-6 w-full animate-fade-in pb-8">
      <div className="flex justify-between items-center mb-2">
         <h3>My Account</h3>
         <button onClick={handleLogout} className="btn btn-outline border-danger text-danger hover:bg-[rgba(239,68,68,0.1)] p-2 rounded-full border-none">
            <LogOut size={18} />
         </button>
      </div>

      <div className="card text-center relative overflow-hidden">
        {/* Background Graphic */}
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '80px', background: 'var(--primary)', opacity: 0.1}}></div>
        
        <div className="mx-auto bg-[var(--surface-light)] flex items-center justify-center relative mt-4 mb-4" style={{width: 80, height: 80, borderRadius: '50%', border: '4px solid var(--surface)'}}>
           <User size={40} className="text-muted" />
        </div>
        
        <h2 className="mb-1">{currentUser.name || 'User'}</h2>
        <div className="flex justify-center gap-2 mb-4">
          <div className="badge badge-verified capitalize">{currentUser.role}</div>
          <div className="badge border border-[rgba(255,255,255,0.1)] flex items-center gap-1 bg-transparent">
             <ShieldCheck size={12} className="text-secondary" /> Aadhaar Verified
          </div>
        </div>

        {currentUser.role === 'worker' && (
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex-col items-center">
               <span className="text-secondary" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{currentUser.rozgarCredit}</span>
               <span className="text-muted" style={{fontSize: '0.75rem'}}>Rozgar-Credit</span>
            </div>
            <div className="flex-col items-center">
               <span className="text-warning flex items-center justify-center gap-1" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{currentUser.rating} <Star size={16} className="fill-warning"/></span>
               <span className="text-muted" style={{fontSize: '0.75rem'}}>Rating</span>
            </div>
            <div className="flex-col items-center">
               <span className="text-primary" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>24</span>
               <span className="text-muted" style={{fontSize: '0.75rem'}}>Jobs Done</span>
            </div>
          </div>
        )}

        <div className="text-left mb-6">
           <label className="input-label mb-2 block">Self Introduction</label>
           <textarea 
             className="input-field w-full" 
             rows="3" 
             value={intro}
             onChange={(e) => setIntro(e.target.value)}
             placeholder="Tell potential employers about your experience..."
           ></textarea>
        </div>

        {currentUser.role === 'worker' && (
          <div className="text-left">
            <label className="input-label mb-2 block">My Skills</label>
            <div className="flex gap-2 flex-wrap">
              {currentUser.skills.map(skill => (
                <span key={skill} className="badge bg-primary text-white">{skill}</span>
              ))}
              <span className="badge cursor-pointer hover:bg-white/20" style={{backgroundColor: 'var(--surface-light)'}}>+ Add Skill</span>
            </div>
          </div>
        )}
      </div>

      <div className="card flex-col gap-4 mt-4">
        <h4 className="mb-2">Settings & Privacy</h4>
        <div className="flex justify-between items-center p-3 glass" style={{borderRadius: 'var(--radius-md)'}}>
           <div className="flex items-center gap-3">
              <MapPin size={20} className="text-primary" />
              <div>
                <div style={{fontWeight: 500}}>Location Tracking</div>
                <div className="text-muted" style={{fontSize: '0.75rem'}}>Required for nearby gigs</div>
              </div>
           </div>
           <input type="checkbox" defaultChecked style={{width: 20, height: 20}} />
        </div>
        
        <div className="flex justify-between items-center p-3 glass" style={{borderRadius: 'var(--radius-md)'}}>
           <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-secondary" />
              <div>
                <div style={{fontWeight: 500}}>Women-Only Safety</div>
                <div className="text-muted" style={{fontSize: '0.75rem'}}>Hide profile from male users</div>
              </div>
           </div>
           <input type="checkbox" style={{width: 20, height: 20}} />
        </div>
      </div>
    </div>
  );
}
