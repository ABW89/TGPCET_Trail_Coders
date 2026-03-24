import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, Briefcase, User, Mic } from 'lucide-react';
import { useState } from 'react';
import VoiceAssistantModal from './VoiceAssistantModal';

export default function Layout() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const navigate = useNavigate();

  const toggleVoice = () => {
    setVoiceOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header glass">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div style={{width: 32, height: 32, backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}} className="text-white">
            R
          </div>
          <h2 style={{fontSize: '1.25rem', margin: 0}}>RozgarSaathi</h2>
        </div>
        <button 
          onClick={toggleVoice} 
          className="btn btn-outline"
          style={{padding: '0.4rem 1rem', borderRadius: '50px'}}
          title="Open Voice AI"
        >
          <Mic size={18} />
          <span style={{ fontSize: '0.875rem' }}>Voice AI</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="container py-4 flex-col gap-4 animate-fade-in" style={{flex: 1}}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav glass">
        <NavLink to="/worker" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Home size={24} />
          <span>Feed</span>
        </NavLink>
        <NavLink to="/map" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <MapPin size={24} />
          <span>Map</span>
        </NavLink>
        <NavLink to="/consumer" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Briefcase size={24} />
          <span>My Jobs</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <User size={24} />
          <span>Account</span>
        </NavLink>
      </nav>

      {/* WhatsApp-like Voice Assistant Slide Pop */}
      <VoiceAssistantModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}
