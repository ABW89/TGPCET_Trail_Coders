import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Fingerprint } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'worker';
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(aadhaar.length >= 10) setStep(2);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (role === 'worker') {
      navigate('/worker');
    } else {
      navigate('/consumer');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="card w-full animate-fade-in" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-6 flex-col items-center justify-center">
          <div className="badge badge-verified mb-4" style={{ margin: '0 auto' }}>
            <ShieldCheck size={14} className="mr-1" /> Secure {role === 'worker' ? 'Worker' : 'Employer'} Login
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted mt-2">Enter your Aadhaar number to continue</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Aadhaar Number / Mobile</label>
              <div style={{ position: 'relative' }}>
                <Fingerprint size={18} className="text-muted" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input 
                  type="text" 
                  className="input-field w-full" 
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  placeholder="0000 0000 0000"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4" style={{width: '100%'}}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex-col gap-4 animate-fade-in">
             <div className="input-group">
              <label className="input-label">Enter OTP Sent to Mobile</label>
              <input 
                type="text" 
                className="input-field w-full text-center" 
                style={{ width: '100%', letterSpacing: '0.5rem', fontSize: '1.25rem' }}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary w-full mt-4" style={{width: '100%'}}>
              Verify & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
