import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, LogOut, ShieldCheck, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, updateProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [intro, setIntro] = useState(currentUser?.intro || '');
  const [skills, setSkills] = useState(currentUser?.skills || ['Plumber', 'Electrician']);
  const [isEditing, setIsEditing] = useState(false);

  // Skill Verification Modal State
  const [isSkillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSave = () => {
    updateProfile({ intro, skills });
    setIsEditing(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleRemoveSkill = (target) => {
    setSkills(skills.filter(s => s !== target));
  };

  const handleSaveSkill = () => {
    const finalSkill = selectedSkill === 'Other' ? customSkill : selectedSkill;
    if (finalSkill && !skills.includes(finalSkill)) {
      setSkills([...skills, finalSkill]);
    }
    setSkillModalOpen(false);
    setSelectedSkill('');
    setCustomSkill('');
    setUploadedFile(null);
  };

  const closeSkillModal = () => {
    setSkillModalOpen(false);
    setSelectedSkill('');
    setCustomSkill('');
    setUploadedFile(null);
  };

  if (!currentUser) return null;

  return (
    <div className="flex-col gap-6 w-full animate-fade-in pb-8 h-full relative">
      <div className="flex justify-between items-center mb-2">
         <h3>My Account</h3>
         <button className="btn btn-outline border-danger text-danger hover:bg-[rgba(239,68,68,0.1)]" onClick={handleLogout} style={{padding: '0.4rem'}}>
           <LogOut size={18} />
         </button>
      </div>

      <div className="card text-center p-6 border-primary relative overflow-hidden" style={{marginTop: '2rem'}}>
         <div className="absolute top-0 left-0 w-full h-32 bg-primary/20" style={{borderBottom: '1px solid rgba(79,70,229,0.3)'}}></div>
         <div className="relative mx-auto bg-surface flex items-center justify-center rounded-full border-4 border-[var(--background)] z-10" style={{width: 80, height: 80, marginTop: '-2rem', marginBottom: '1rem'}}>
           <User size={40} className="text-muted" />
         </div>
         
         <h2 className="mb-1">{currentUser.name || 'Worker'}</h2>
         <div className="flex gap-2 justify-center mb-6">
           <span className="badge badge-verified capitalize">{currentUser.role}</span>
           <span className="badge badge-verified border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] text-secondary">
             <ShieldCheck size={12} className="mr-1"/> Aadhaar Verified
           </span>
         </div>

         <div className="grid grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6">
            <div className="flex-col items-center">
              <div className="text-secondary" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{currentUser.rozgarCredit || 92}</div>
              <div className="text-muted" style={{fontSize: '0.75rem'}}>Rozgar-Credit</div>
            </div>
            <div className="flex-col items-center">
              <div className="text-primary flex items-center justify-center gap-1" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                 {currentUser.rating || '4.8'}<span style={{fontSize:'1rem'}}>★</span>
              </div>
              <div className="text-muted" style={{fontSize: '0.75rem'}}>Rating</div>
            </div>
            <div className="flex-col items-center">
              <div className="text-white" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>24</div>
              <div className="text-muted" style={{fontSize: '0.75rem'}}>Jobs Done</div>
            </div>
         </div>
      </div>

      <div className="card border-[rgba(255,255,255,0.05)]">
         <div className="flex justify-between items-center mb-4">
           <h4 className="text-muted m-0" style={{fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Self Introduction</h4>
           {!isEditing && <button className="text-primary hover:text-white transition-all" style={{background:'transparent', border:'none', cursor:'pointer', fontSize:'0.875rem'}} onClick={() => setIsEditing(true)}>Edit Profile</button>}
         </div>
         
         {isEditing ? (
           <div className="flex-col gap-2">
             <textarea 
               className="input-field w-full" 
               rows="3" 
               value={intro}
               onChange={e => setIntro(e.target.value)}
               placeholder="Tell employers about your experience..."
             ></textarea>
           </div>
         ) : (
           <p className="text-white/80" style={{fontSize: '0.95rem', lineHeight: '1.5'}}>
             {intro || "Passionate about my work. I have 5 years of experience in local gigs."}
           </p>
         )}
      </div>

      <div className="card border-[rgba(255,255,255,0.05)] mb-8">
        <h4 className="text-muted mb-4" style={{fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px'}}>My Skills</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="badge bg-[rgba(79,70,229,0.15)] text-primary border border-primary/30 flex items-center gap-1 px-3 py-1">
              <ShieldCheck size={14} /> {skill}
              {isEditing && (
                <X size={14} className="ml-1 cursor-pointer hover:text-white" onClick={() => handleRemoveSkill(skill)} />
              )}
            </span>
          ))}
          {isEditing && (
            <button 
              className="badge bg-surface text-white hover:bg-white/10 border border-white/20 cursor-pointer transition-all"
              onClick={() => setSkillModalOpen(true)}
            >
              + Add Skill
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <button className="btn btn-primary w-full shadow-lg" onClick={handleSave}>Save Profile</button>
          </div>
        )}
      </div>

      {/* Advanced Add Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
          <div className="card w-full max-w-sm p-6 relative shadow-2xl" style={{ backgroundColor: 'var(--surface)', borderRadius: '1.5rem 1.5rem 0 0', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <button onClick={closeSkillModal} className="absolute top-4 right-4 text-muted bg-transparent border-none cursor-pointer hover:text-white"><X size={20}/></button>
            <h3 className="mb-4 text-xl flex items-center gap-2"><ShieldCheck size={20} className="text-primary"/> Add Verified Skill</h3>
            
            <div className="input-group">
              <label className="input-label">Select Category</label>
              <select 
                 className="input-field w-full" 
                 value={selectedSkill}
                 onChange={e => setSelectedSkill(e.target.value)}
              >
                <option value="">-- Choose Skill --</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Painter">Painter</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Mazdoor">Mazdoor / Laborer</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Leadership">Leadership / Manager</option>
                <option value="Other">Other...</option>
              </select>
            </div>

            {selectedSkill === 'Other' && (
               <div className="input-group animate-fade-in" style={{animation: 'fadeIn 0.3s ease'}}>
                 <label className="input-label">Specify Skill Name</label>
                 <input type="text" className="input-field w-full" placeholder="e.g. Tile Mason" value={customSkill} onChange={e => setCustomSkill(e.target.value)} />
               </div>
            )}

            {selectedSkill && (
               <div className="input-group animate-fade-in mt-4 border-t border-[rgba(255,255,255,0.05)] pt-4" style={{animation: 'fadeIn 0.3s ease'}}>
                 <label className="input-label flex items-center gap-2 text-white">Verification Proof Required</label>
                 <p className="text-muted mb-3" style={{fontSize: '0.75rem', lineHeight: '1.4'}}>Please upload a certificate, past work photo, or ID depicting your skill to get the Verified Badge.</p>
                 
                 <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[rgba(255,255,255,0.2)] rounded-xl cursor-pointer hover:bg-white/5 transition-all text-center relative overflow-hidden group">
                   <Upload size={24} className={uploadedFile ? 'text-secondary mb-2 transition-transform group-hover:-translate-y-1' : 'text-primary mb-2 transition-transform group-hover:-translate-y-1'} />
                   <span className="text-sm font-medium mb-1 truncate w-full px-4" style={{color: uploadedFile ? 'var(--secondary)' : 'white'}}>
                     {uploadedFile ? uploadedFile.name : 'Tap to upload document'}
                   </span>
                   <span className="text-xs text-muted">JPG, PNG, or PDF (max 5MB)</span>
                   <input type="file" className="hidden" onChange={e => setUploadedFile(e.target.files[0])} accept="image/*,.pdf" />
                 </label>
               </div>
            )}

            <button 
              className={`btn w-full mt-6 ${!selectedSkill || !uploadedFile || (selectedSkill === 'Other' && !customSkill) ? 'btn-outline opacity-50' : 'btn-primary shadow-lg'}`}
              disabled={!selectedSkill || !uploadedFile || (selectedSkill === 'Other' && !customSkill)}
              onClick={handleSaveSkill}
            >
              Verify & Add Skill
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
