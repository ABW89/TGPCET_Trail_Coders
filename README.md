# RozgarSaathi (TGPDS-02)

**RozgarSaathi** is a hyperlocal daily-gig platform designed for daily wage workers (plumbers, electricians, painters, mazdoors) in India. It aims to eliminate middlemen and commissions, providing workers with digital visibility and same-day jobs from households or contractors directly.

## 🚀 Features

### Core Workflows
* **Unified Onboarding**: Secure Registration and Sign-In flows with Aadhaar Mock OTP validation. Split roles for Worker and Employer.
* **Employer Dashboard**: Easily post same-day gigs defining skill required, location, estimated wage, urgency, and a women-only privacy toggle.
* **Worker Dashboard**: Geo-based job feed showing gigs strictly within a 1-5km radius. Priority is decided using a live "Rozgar-Credit" score.
* **Live GPS Tracking**: Integrated `react-leaflet` Maps to visualize nearby gigs, worker distances, and real-time mapping.
* **WhatsApp-Style Communications**: Dedicated chat modal to securely contact workers or employers assigned to a gig.
* **Ghost Rate & Feedback System**: Comprehensive review system that tracks task completion, allows fair-play ratings, and contains a specific flow to report "No-Shows".

### AI & Accessibility 
* **Voice-First AI Assistant**: For low-literacy users, a floating microphone button triggers a WhatsApp-styled Voice AI drawer using Web Speech API for voice-to-text live transcription.
* **Context-Aware AI Engine**: The AI Assistant reads the live dashboard state (reading exactly what gigs are open and nearby) by securely utilizing the Google Gemini Flash API (`generativelanguage.googleapis.com`), ensuring smart, specific, hallucination-free assistance.
* **Localization**: Quick language-switcher built into the Landing Page (English, Hindi, Marathi, Bengali, Telugu) to accommodate regional users.

## 🛠️ Technology Stack
* **Frontend Framework**: React 18, Vite.
* **Routing**: React Router (`react-router-dom`).
* **Design System**: Strict Vanilla CSS (`index.css`) featuring modern standard Glassmorphism UI tokens, dark-mode styling, and fully responsive mobile-first architecture.
* **Maps & Geolocation**: `leaflet`, `react-leaflet`.
* **Icons**: `lucide-react`.
* **AI Integration**: Google Gemini (`1.5-flash` endpoint) & Web Browser APIs (`SpeechSynthesis` + `SpeechRecognition`).

## 💻 Getting Started
*This section gives clear instructions for anyone cloning this repo on how to run `npm install`, add their Gemini API key to `.env`, and start the server.*

### Prerequisites
* Node.js (v18+)

### Installation
1. Clone the repository and navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the Environment Variables:
   Create a `.env` file in the root of the project and add your Google Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the Development Server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`.

## 📌 Architecture Notes
* **Mocked Backend**: State is currently managed globally via `AppContext.jsx`. It securely simulates database interactions, gig assignments, and mocked Aadhaar validations in real-time.
* **Security**: No database calls are actually made; all state lives in the browser session memory.
