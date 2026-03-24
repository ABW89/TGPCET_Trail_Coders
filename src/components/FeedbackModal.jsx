import { useState } from 'react';
import { X, Star, Ghost, QrCode, CheckCircle } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, targetName, isWorker, amount = 500 }) {
  const [rating, setRating] = useState(0);
  const [step, setStep] = useState('feedback'); // 'feedback' | 'payment'

  if (!isOpen) return null;

  const handleNext = () => {
    if (!isWorker) {
      setStep('payment');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Reset state and close
    setStep('feedback');
    setRating(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="card w-full max-w-md bg-[var(--surface-light)] relative overflow-hidden transition-all duration-300 shadow-2xl">
         <div className="flex justify-between items-center mb-4">
           <h3>{step === 'feedback' ? `Rate ${targetName}` : 'Secure Payment'}</h3>
           <button onClick={handleComplete} className="btn border-none hover:text-white" style={{background: 'transparent', padding: '0.2rem'}}>
             <X size={20} className="text-muted" />
           </button>
         </div>

         {step === 'feedback' ? (
           <div className="animate-fade-in flex flex-col gap-4">
             <p className="text-muted m-0">How was your experience with {targetName}?</p>
             
             <div className="flex justify-center gap-2 mb-2">
               {[1,2,3,4,5].map(star => (
                 <Star 
                   key={star} 
                   size={36} 
                   className={`cursor-pointer transition-colors ${rating >= star ? 'text-warning fill-warning' : 'text-muted'}`}
                   onClick={() => setRating(star)}
                 />
               ))}
             </div>

             {/* Ghost Rate Feature */}
             <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                <h4 className="flex items-center gap-2 text-danger mb-2">
                  <Ghost size={18} /> Report Ghosting
                </h4>
                <p className="text-sm text-muted mb-3" style={{fontSize: '0.875rem'}}>
                  Did they accept but never show up? Report them to adjust their Rozgar-Credit fair-play score.
                </p>
                <button className="btn btn-outline border-danger text-danger w-full hover:bg-danger hover:text-white transition-all" onClick={handleComplete}>
                  Report No-Show
                </button>
             </div>

             <div className="input-group mb-0">
               <label className="input-label">Additional Comments (Optional)</label>
               <textarea className="input-field" rows="2" placeholder="Any issues or compliments?"></textarea>
             </div>

             <button 
               className={`btn w-full mt-2 shadow-lg ${rating === 0 ? 'btn-outline opacity-50' : 'btn-primary'}`} 
               onClick={handleNext}
               disabled={rating === 0}
             >
               {!isWorker ? `Proceed to Pay ₹${amount}` : 'Submit Feedback'}
             </button>
           </div>
         ) : (
           <div className="animate-fade-in flex flex-col items-center justify-center text-center py-4">
             <p className="text-muted mb-4" style={{fontSize: '0.95rem'}}>Scan the QR Code using any UPI app (GPay, PhonePe, Paytm) to quickly pay <b>{targetName}</b>.</p>
             
             <div className="p-5 bg-white rounded-2xl mb-6 shadow-2xl relative inline-block">
               <QrCode size={180} className="text-black" strokeWidth={1} />
               {/* Center mock logo layout for UPI */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md">
                 <div className="bg-primary text-white font-bold text-sm rounded-sm flex items-center justify-center" style={{width: 32, height: 32}}>
                   ₹
                 </div>
               </div>
             </div>

             <div className="flex flex-col gap-1 w-full mb-6 glass p-4 border-primary/20 shadow-inner" style={{borderRadius: 'var(--radius-lg)'}}>
               <span className="text-muted" style={{fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Total Amount</span>
               <span className="text-secondary text-3xl font-bold tracking-tight">₹{amount}</span>
             </div>

             <button className="btn btn-secondary w-full py-3 shadow-lg flex items-center justify-center gap-2" onClick={handleComplete}>
               <CheckCircle size={18} /> I Have Completed the Payment
             </button>
             <button className="btn btn-outline border-none w-full mt-2 text-muted hover:text-white transition-colors" onClick={() => setStep('feedback')}>
               Back to Rating
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
