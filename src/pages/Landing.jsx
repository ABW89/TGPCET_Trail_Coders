import { useNavigate } from 'react-router-dom';
import { Hammer, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center glass animate-fade-in w-full gap-8">
      <div className="mb-4 flex flex-col items-center justify-center mt-12 w-full">
        <div style={{ width: 80, height: 80, backgroundColor: 'var(--primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.5)' }}>
          <Hammer size={40} color="white" />
        </div>
        <h1 className="text-primary mb-2" style={{ fontSize: '3rem', fontWeight: 800 }}>RozgarSaathi</h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '400px' }}>
          Your hyperlocal daily-gig platform.<br/>No middlemen. No commission.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card text-center flex-col items-center cursor-pointer hover:border-primary border border-[rgba(255,255,255,0.05)]" onClick={() => navigate('/login?role=worker')}>
          <div className="flex justify-center w-full mb-4"><Hammer size={32} className="text-primary" /></div>
          <h3 className="mb-2">I am a Worker</h3>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Find local daily gigs instantly.</p>
        </div>
        
        <div className="card text-center flex-col items-center cursor-pointer hover:border-secondary border border-[rgba(255,255,255,0.05)]" onClick={() => navigate('/login?role=consumer')}>
          <div className="flex justify-center w-full mb-4"><Users size={32} className="text-secondary" /></div>
          <h3 className="mb-2">I am an Employer</h3>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Hire skilled workers same-day.</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full justify-center" style={{ maxWidth: '600px' }}>
         <div className="card flex items-center gap-2" style={{ padding: '0.75rem 1rem' }}>
           <ShieldCheck size={20} className="text-secondary" />
           <span className="text-muted" style={{fontSize: '0.875rem'}}>Aadhaar Verified</span>
         </div>
         <div className="card flex items-center gap-2" style={{ padding: '0.75rem 1rem' }}>
           <MapPin size={20} className="text-primary" />
           <span className="text-muted" style={{fontSize: '0.875rem'}}>Geo-Based Matches</span>
         </div>
      </div>
      
      <div className="mb-12"></div>
    </div>
  );
}
