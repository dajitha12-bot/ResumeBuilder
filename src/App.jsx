import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyResumes from './pages/MyResumes';
import MyCoverLetters from './pages/MyCoverLetters';
import CoverLetterBuilder from './pages/CoverLetterBuilder';
import TemplatesPage from './pages/TemplatesPage';
import ResumeBuilder from './pages/ResumeBuilder';
import AICareerAssistant from './pages/AICareerAssistant';
import { api } from './services/api';
import { Menu, Sparkles } from 'lucide-react';

const DEFAULT_RESUME = {
  id: 'resume_001',
  title: 'Software Developer Resume',
  targetRole: 'Software Engineer',
  template: 'classic_serif',
  personalInfo: {
    fullName: 'Ajitha D R',
    subtitle: 'B.Tech – Information Technology',
    email: 'dajitha12@gmail.com',
    phone: '6374784776',
    location: 'Aruppukottai, Virudhunagar District, Tamil Nadu',
    linkedin: 'linkedin.com/in/ajitha-d-r-b3697b323',
    github: 'https://github.com/dajitha12-bot',
    portfolio: ''
  },
  summary: 'Motivated B.Tech IT student with strong skills in React, Java, and REST API development. Eager to contribute to software engineering initiatives.',
  education: [
    { degree: 'B.Tech – Information Technology', institution: 'National Engineering College', year: '2024 – 2028', details: 'CGPA: 8.7' }
  ],
  skills: {
    languages: ['Java', 'JavaScript', 'React', 'SQL', 'C++'],
    frameworks: ['Spring Boot', 'Node.js', 'Tailwind CSS']
  },
  projects: [
    { name: 'AI Resume Builder', duration: '2026', description: 'Interactive AI resume & cover letter builder with FlowCV engine.' }
  ],
  experience: [],
  certifications: [],
  achievements: [],
  interests: ['Full Stack Web Development', 'Cloud Computing', 'Open Source'],
  positions: [],
  languages: ['English (Fluent)', 'Tamil (Native)'],
  links: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [templateType, setTemplateType] = useState('resumes');
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [vaultItems, setVaultItems] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState(null);
  const [truthStatus, setTruthStatus] = useState({ verified: true, truthScore: 100, findings: [] });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (tab, subType) => {
    setActiveTab(tab);
    if (tab === 'templates') {
      setTemplateType(subType || 'resumes');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const u = await api.getUser('user_001');
        setUser(u);

        const rList = await api.getResumes('user_001');
        if (rList?.length) {
          setResume(rList[0]);
        } else {
          setResume(DEFAULT_RESUME);
        }

        const vList = await api.getCareerVault('user_001');
        setVaultItems(vList);

        const verList = await api.getResumeVersions('user_001');
        setVersions(verList);

        if (rList?.[0]) {
          const tReport = await api.verifyClaims('user_001', rList[0]);
          setTruthStatus(tReport);
        }
      } catch (e) {
        console.warn('API fetch warning:', e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (resume && user) {
      api.verifyClaims(user.id || 'user_001', resume)
        .then(rep => setTruthStatus(rep))
        .catch(err => console.error(err));
    }
  }, [resume]);

  return (
    <div className="min-h-screen bg-slatebg text-slate-800 flex font-sans">
      
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        truthStatus={truthStatus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span className="font-extrabold text-slate-900 text-sm">AI Resume Builder</span>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 capitalize">{activeTab.replace('-', ' ')}</span>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && (
            <Dashboard
              user={user}
              resume={resume}
              vaultItems={vaultItems}
              versions={versions}
              truthReport={truthStatus}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'my-resumes' && (
            <MyResumes
              resume={resume}
              setResume={setResume}
              versions={versions}
              setVersions={setVersions}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'cover-letters' && (
            <MyCoverLetters
              onNavigate={handleNavigate}
              onEditLetter={(id) => setSelectedCoverLetterId(id)}
            />
          )}

          {activeTab === 'cover-letter-builder' && (
            <CoverLetterBuilder
              letterId={selectedCoverLetterId}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesPage
              key={`tpl_${templateType}`}
              resume={resume}
              setResume={setResume}
              onNavigate={handleNavigate}
              initialType={templateType}
              onTypeChange={setTemplateType}
              onEditCoverLetter={(id) => setSelectedCoverLetterId(id)}
            />
          )}

          {activeTab === 'builder' && (
            <ResumeBuilder
              resume={resume}
              setResume={setResume}
              truthStatus={truthStatus}
              versions={versions}
              setVersions={setVersions}
              onNavigate={handleNavigate}
              onRefreshTruth={() => api.verifyClaims('user_001', resume).then(setTruthStatus)}
            />
          )}

          {activeTab === 'assistant' && (
            <AICareerAssistant
              resume={resume}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 AI Resume Builder — FlowCV Engine</span>
            <span className="font-semibold text-brand-600">Ajitha D R — National Engineering College</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
