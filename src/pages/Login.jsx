import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Fingerprint, User, Building, Phone, MapPin, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'worker';
  const navigate = useNavigate();
  
  // flow: choose_action | login | register_type | register_form | otp
  const [flow, setFlow] = useState('choose_action'); 
  const [authMode, setAuthMode] = useState(''); // 'login' or 'register'
  
  // Registration specific
  const [consumerType, setConsumerType] = useState('personal'); // personal | organization
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    mobile: '',
    aadhaar: ''
  });
  
  // OTP specific
  const [otp, setOtp] = useState('');

  const handleActionChoose = (action) => {
    setAuthMode(action);
    if (action === 'register' && role === 'consumer') {
      setFlow('register_type');
    } else if (action === 'register') {
      setFlow('register_form');
    } else {
      setFlow('login');
    }
  };

  const handleConsumerTypeChoose = (type) => {
    setConsumerType(type);
    setFlow('register_form');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFlow('otp');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Bypass OTP for Login since Aadhaar validation is only for registration
    if (role === 'worker') {
      navigate('/worker');
    } else {
      navigate('/consumer');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      if (role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/consumer');
      }
    } else {
      alert("Invalid OTP. Please use 123456.");
    }
  };

  const renderContent = () => {
    switch(flow) {
      case 'choose_action':
        return (
          <div className="flex-col gap-4 animate-fade-in w-full text-center">
            <h2 className="mb-2">Welcome</h2>
            <p className="text-muted mb-6">Choose an option to continue as a {role}</p>
            <div className="grid grid-cols-2 gap-4">
               <button className="btn btn-outline flex-col py-6 hover:bg-white/5" onClick={() => handleActionChoose('login')} style={{ height: 'auto' }}>
                  <span style={{fontSize: '1.25rem'}}>Sign In</span>
                  <span className="text-muted" style={{fontSize: '0.75rem'}}>Already registered</span>
               </button>
               <button className="btn btn-primary flex-col py-6" onClick={() => handleActionChoose('register')} style={{ height: 'auto' }}>
                  <span style={{fontSize: '1.25rem'}}>Register</span>
                  <span className="text-white/70" style={{fontSize: '0.75rem'}}>Create an account</span>
               </button>
            </div>
          </div>
        );
        
      case 'register_type':
        return (
          <div className="flex-col gap-4 animate-fade-in w-full text-center">
            <h2 className="mb-2">Employer Type</h2>
            <p className="text-muted mb-6">Are you hiring for yourself or a company?</p>
            <div className="grid grid-cols-2 gap-4">
               <button className="btn card hover:border-primary flex-col items-center py-6 border border-transparent" onClick={() => handleConsumerTypeChoose('personal')} style={{background: 'var(--surface-light)'}}>
                  <User size={32} className="text-primary mb-2" />
                  <span>Personal</span>
               </button>
               <button className="btn card hover:border-secondary flex-col items-center py-6 border border-transparent" onClick={() => handleConsumerTypeChoose('organization')} style={{background: 'var(--surface-light)'}}>
                  <Building size={32} className="text-secondary mb-2" />
                  <span>Organization</span>
               </button>
            </div>
            <button className="btn btn-outline mt-4 w-full" onClick={() => setFlow('choose_action')}>Back</button>
          </div>
        );

      case 'login':
        return (
          <form onSubmit={handleLoginSubmit} className="flex-col gap-4 animate-fade-in w-full">
            <h3 className="text-center mb-4">Sign In</h3>
            
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input 
                  type="email" 
                  className="input-field w-full" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input 
                  type="password" 
                  className="input-field w-full" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button type="button" className="btn btn-outline flex-1" onClick={() => setFlow('choose_action')}>Back</button>
              <button type="submit" className="btn btn-primary flex-1">Sign In</button>
            </div>
          </form>
        );

      case 'register_form':
        return (
          <form onSubmit={handleRegisterSubmit} className="flex-col gap-4 w-full animate-fade-in" style={{maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem'}}>
            <h3 className="text-center mb-4 text-xl">
              {role === 'worker' ? 'Worker Registration' : `${consumerType === 'organization' ? 'Organization' : 'Personal'} Employer`}
            </h3>
            
            <div className="input-group mb-0">
               <label className="input-label">{consumerType === 'organization' && role === 'consumer' ? 'Organization Name' : 'Full Name'}</label>
               <div style={{ position: 'relative' }}>
                <User size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="text" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="eg. Ramesh Kumar" required />
               </div>
            </div>

            <div className="input-group mb-0">
               <label className="input-label">Email Address</label>
               <div style={{ position: 'relative' }}>
                <Mail size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="email" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" required />
               </div>
            </div>

            <div className="input-group mb-0">
               <label className="input-label">Password</label>
               <div style={{ position: 'relative' }}>
                <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="password" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required />
               </div>
            </div>
            
            <div className="input-group mb-0">
               <label className="input-label">Mobile Number</label>
               <div style={{ position: 'relative' }}>
                <Phone size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="tel" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="9876543210" required />
               </div>
            </div>

            <div className="input-group mb-0">
               <label className="input-label">Location</label>
               <div style={{ position: 'relative' }}>
                <MapPin size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="text" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, Ward or Area" required />
               </div>
            </div>

            <div className="input-group">
               <label className="input-label">Aadhaar Validation</label>
               <div style={{ position: 'relative' }}>
                <Fingerprint size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input type="text" className="input-field w-full" style={{ paddingLeft: '2.5rem' }} value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} placeholder="0000 0000 0000" required />
               </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => role === 'consumer' ? setFlow('register_type') : setFlow('choose_action')}>Back</button>
              <button type="submit" className="btn btn-primary" style={{flex: 2}}>Send OTP</button>
            </div>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerify} className="flex-col gap-4 animate-fade-in w-full text-center">
             <div className="badge badge-verified mb-4 mx-auto">
               <ShieldCheck size={14} className="mr-1" /> OTP Sent to Mobile
             </div>
             <h3>Verification</h3>
             <p className="text-muted mb-4" style={{fontSize: '0.875rem'}}>Enter hardcoded OTP: <b>123456</b></p>
             <div className="input-group">
              <input 
                type="text" 
                className="input-field w-full text-center" 
                style={{ letterSpacing: '0.5rem', fontSize: '1.25rem' }}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button type="button" className="btn btn-outline flex-1" onClick={() => setFlow('register_form')}>Back</button>
              <button type="submit" className="btn btn-secondary flex-1">Confirm Info</button>
            </div>
          </form>
        );
      
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="card w-full flex-col flex items-center" style={{ maxWidth: '400px' }}>
        <div className="text-center w-full mb-6">
           <UserProfileIcon role={role} />
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

function UserProfileIcon({ role }) {
  if (role === 'worker') {
    return (
      <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)', padding: '1rem', borderRadius: '50%', display: 'inline-block' }} className="text-primary mb-2">
        <User size={40} />
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', display: 'inline-block' }} className="text-secondary mb-2">
      <Building size={40} />
    </div>
  );
}
