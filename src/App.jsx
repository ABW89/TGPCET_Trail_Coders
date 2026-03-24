import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import WorkerDashboard from './pages/WorkerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import MapWidget from './pages/MapWidget';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/consumer" element={<ConsumerDashboard />} />
          <Route path="/map" element={<MapWidget />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
