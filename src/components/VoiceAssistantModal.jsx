import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Send, Bot, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const { jobs, currentUser } = useAppContext();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Rozgar AI. I can scan your dashboard in real-time. Ask me about available gigs or your profile.' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language] = useState('en-US'); 
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Prevents abrupt continuous resets
      recognition.interimResults = true;
      recognition.lang = 'en-US'; 

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access blocked. Please allow mic permissions in your browser.");
        }
      };
      
      recognition.onend = () => {
         if (isListening) setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [isListening, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript, isTyping]);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please type your message instead.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (transcript.trim() !== '') {
        handleUserMessage(transcript);
        setTranscript('');
      }
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition", err);
        setIsListening(false);
      }
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous speech queue
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1;
      msg.pitch = 1;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleUserMessage = async (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setIsTyping(true);
    
    // Context compilation
    const openJobs = jobs.filter(j => j.status === 'open');
    const jobsContext = openJobs.map(j => `${j.skillNeeded} for ₹${j.wage} at ${j.distance}`).join(', ');
    const systemPrompt = `You are Rozgar AI, a highly helpful assistant for daily wage workers in India. The user is currently logged in as a ${currentUser.role}. Currently on the map, there are ${openJobs.length} open jobs available: ${jobsContext || 'None'}. Keep your answers strictly under 3 sentences, very conversational, and answer based ONLY on the available jobs data provided here. Do not make up jobs. Provide precise assistance.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
         throw new Error("Missing API Key");
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\nUser Question: " + text }] }]
        })
      });
      
      if (!res.ok) throw new Error("API responded with an error");
      
      const data = await res.json();
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      speakMessage(aiResponse);
      
    } catch (err) {
      console.error(err);
      const errorMsg = err.message === "Missing API Key" 
        ? "Please configure your Gemini API Key in the .env file to enable live AI."
        : "Sorry, I couldn't reach the AI servers right now.";
      setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
      speakMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendManual = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleUserMessage(transcript);
      setTranscript('');
      if (isListening) {
         recognitionRef.current?.stop();
         setIsListening(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        zIndex: 9999,
        bottom: '80px', 
        left: '20px', 
        width: '320px', 
        height: '450px', 
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#1E293B',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease forwards'
      }}
    >
        {/* Header */}
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', borderBottom: '1px solid #334155' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)', padding: '8px', borderRadius: '50%', color: '#4F46E5', display: 'flex' }}>
               <Bot size={20} />
             </div>
             <div>
               <h4 style={{ margin: 0, color: 'white', fontSize: '15px', fontWeight: 600 }}>Rozgar Voice Chat</h4>
               <span style={{ color: '#10B981', fontSize: '11px', fontWeight: 'bold' }}>Online • Ready</span>
             </div>
           </div>
           <button 
             onClick={onClose} 
             style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex' }}
             onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
           >
             <X size={20} />
           </button>
        </div>
        
        {/* Chat Body */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0F172A' }}>
           {messages.map((m, i) => (
             <div key={i} style={{ display: 'flex', width: '100%', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
               <div 
                 style={{
                   maxWidth: '85%',
                   padding: '10px 14px',
                   borderRadius: m.sender === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                   backgroundColor: m.sender === 'user' ? '#10B981' : '#1E293B',
                   color: 'white',
                   border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                   fontSize: '14px',
                   lineHeight: '1.4',
                   boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                   wordBreak: 'break-word'
                 }}
               >
                 {m.text}
                 <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '10px', color: m.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>Just now</div>
               </div>
             </div>
           ))}
           
           {/* Typing Indicator */}
           {isTyping && (
             <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
               <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', backgroundColor: '#1E293B', color: 'white', fontSize: '12px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <Loader2 size={14} className="text-secondary" style={{ animation: 'spin 1s linear infinite' }} /> Processing tasks...
               </div>
             </div>
           )}

           {/* Live Transcription Bubble */}
           {isListening && transcript && (
             <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
               <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', backgroundColor: '#10B981', color: 'white', opacity: 0.8, fontStyle: 'italic', fontSize: '14px', wordBreak: 'break-word' }}>
                 {transcript} <span style={{ animation: 'blink 1s infinite' }}>|</span>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '12px', display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#1E293B', borderTop: '1px solid #334155' }}>
           <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
             <input 
               type="text" 
               style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid #334155', color: 'white', borderRadius: '24px', padding: '10px 40px 10px 16px', fontSize: '14px', outline: 'none' }}
               placeholder="Ask about gigs..."
               value={transcript}
               onChange={(e) => setTranscript(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSendManual(e)}
             />
             {transcript.trim() !== '' && !isListening && (
                <button 
                  onClick={handleSendManual} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#10B981', display: 'flex', padding: 0 }}
                >
                  <Send size={18} />
                </button>
             )}
           </div>
           
           <button 
             onClick={toggleListen}
             title={isListening ? "Stop Listening" : "Start Listening"}
             style={{ 
               border: 'none', cursor: 'pointer', width: '40px', height: '40px', flexShrink: 0, borderRadius: '50%',
               backgroundColor: isListening ? '#EF4444' : '#10B981',
               color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
               boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.5)' : '0 4px 10px rgba(16, 185, 129, 0.3)',
               transition: 'all 0.2s'
             }}
           >
             {isListening ? <MicOff size={20} /> : <Mic size={20} />}
           </button>
        </div>
        
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  );
}
