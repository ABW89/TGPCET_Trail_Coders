import { useState } from 'react';
import { X, Send, PhoneCall } from 'lucide-react';

export default function ChatModal({ isOpen, onClose, contactName }) {
  const [messages, setMessages] = useState([
    { sender: 'other', text: 'Are you coming?' },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="card w-full max-w-md p-0 overflow-hidden flex-col flex" style={{height: '500px'}}>
        {/* Header */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center glass">
           <div>
             <h4 className="m-0 text-white">{contactName}</h4>
             <span className="text-secondary text-xs" style={{fontSize: '0.75rem'}}>Online</span>
           </div>
           <div className="flex gap-2">
             <button className="btn btn-outline" style={{padding: '0.4rem', borderRadius: '50%'}}>
               <PhoneCall size={16} />
             </button>
             <button onClick={onClose} className="btn border-none" style={{padding: '0.4rem', background: 'transparent', color: 'var(--text-muted)'}}>
               <X size={20} />
             </button>
           </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex-col gap-3" style={{display: 'flex', flexDirection: 'column'}}>
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
               <div className={`p-3 rounded-lg max-w-[80%] ${m.sender === 'me' ? 'bg-primary text-white' : 'glass text-white'}`} style={{borderRadius: m.sender==='me' ? '12px 12px 0 12px' : '12px 12px 12px 0'}}>
                 {m.text}
               </div>
             </div>
           ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-[rgba(255,255,255,0.05)] flex gap-2">
           <input 
             type="text" 
             className="input-field flex-1 m-0" 
             style={{margin: 0}}
             placeholder="Type a message..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
           <button type="submit" className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>
             <Send size={18} />
           </button>
        </form>
      </div>
    </div>
  );
}
