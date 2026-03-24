import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    role: 'worker', // worker or consumer
    name: 'Ramesh Kumar',
    skills: ['Plumber', 'Electrician'],
    location: { lat: 21.1458, lng: 79.0882 }, // Nagpur coords as example
    isBusy: false,
    rozgarCredit: 92,
    rating: 4.8
  });

  const [jobs, setJobs] = useState([
    {
      id: 'job1',
      consumerId: 'cons1',
      consumerName: 'Sharma Household',
      skillNeeded: 'Plumber',
      wage: 500,
      timing: 'Immediate',
      womenOnly: false,
      location: { lat: 21.1460, lng: 79.0890 }, // ~100m away
      distance: '150m',
      status: 'open', // open, active, completed
      urgency: 'high'
    },
    {
      id: 'job2',
      consumerId: 'cons2',
      consumerName: 'Local Contractor Group',
      skillNeeded: 'Mazdoor',
      wage: 400,
      timing: 'Today 2 PM',
      womenOnly: false,
      location: { lat: 21.1600, lng: 79.1000 },
      distance: '2.5km',
      status: 'open',
      urgency: 'medium'
    }
  ]);

  const addJob = (job) => {
    setJobs([{ ...job, id: `job${Date.now()}`, status: 'open' }, ...jobs]);
  };

  const applyForJob = (jobId) => {
    // In real app, would create application. Here, we instantly assign.
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'active', workerId: currentUser.id } : j));
    setCurrentUser({ ...currentUser, isBusy: true });
  };

  const updateJobStatus = (jobId, status) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
    if (status === 'completed' || status === 'open') {
      setCurrentUser({ ...currentUser, isBusy: false });
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, jobs, addJob, applyForJob, updateJobStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
