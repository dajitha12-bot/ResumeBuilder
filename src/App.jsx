import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import JobAnalyzerATS from './pages/JobAnalyzerATS';
import CareerVault from './pages/CareerVault';
import AICareerAssistant from './pages/AICareerAssistant';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [vaultItems, setVaultItems] = useState([]);
  const [versions, setVersions] = useState([]);
  const [truthStatus, setTruthStatus] = useState({ verified: true, truthScore: 100, findings: [] });
  const [loading, setLoading] = useState(true);

  // Fetch initial seed data from backend JSON APIs
  useEffect(() => {
    async function loadData() {
      try {
        const u = await api.getUser('user_001');
        setUser(u);

        const rList = await api.getResumes('user_001');
        if (rList?.length) setResume(rList[0]);

        const vList = await api.getCareerVault('user_001');
        setVaultItems(vList);

        const verList = await api.getResumeVersions('user_001');
        setVersions(verList);

        if (rList?.[0]) {
          const tReport = await api.verifyClaims('user_001', rList[0]);
          setTruthStatus(tReport);
        }
      } catch (e) {
        console.warn('API fetch warning, using preloaded state:', e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Re-run Truth Guard check whenever resume state changes
  useEffect(() => {
    if (resume && user) {
      api.verifyClaims(user.id || 'user_001', resume)
        .then(rep => setTruthStatus(rep))
        .catch(err => console.error(err));
    }
  }, [resume]);

  return (
    <div className="min-h-screen bg-slatebg text-slate-800 flex flex-col font-sans">
      
      {/* Responsive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        truthStatus={truthStatus}
      />

      {/* Main Tab Routing Content */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage onNavigate={setActiveTab} />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            resume={resume}
            vaultItems={vaultItems}
            versions={versions}
            truthReport={truthStatus}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'builder' && (
          <ResumeBuilder
            resume={resume}
            setResume={setResume}
            truthStatus={truthStatus}
            onRefreshTruth={() => api.verifyClaims('user_001', resume).then(setTruthStatus)}
          />
        )}

        {activeTab === 'job-analyzer' && (
          <JobAnalyzerATS
            resume={resume}
            setResume={setResume}
            vaultItems={vaultItems}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'career-vault' && (
          <CareerVault
            vaultItems={vaultItems}
            setVaultItems={setVaultItems}
          />
        )}

        {activeTab === 'assistant' && (
          <AICareerAssistant
            resume={resume}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AI Resume Builder & Career Vault Platform</span>
          <span className="font-semibold text-brand-600">Built with React, Vite, Tailwind CSS & Node.js JSON Storage</span>
        </div>
      </footer>

    </div>
  );
}
