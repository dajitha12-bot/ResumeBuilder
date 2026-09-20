import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Layout, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  ShieldCheck, 
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import BulletGeneratorModal from '../components/BulletGeneratorModal';
import TruthGuardBadge from '../components/TruthGuardBadge';
import PreFlightModal from '../components/PreFlightModal';
import { api } from '../services/api';

export default function ResumeBuilder({ resume, setResume, truthStatus, onRefreshTruth }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [template, setTemplate] = useState(resume?.template || 'modern');
  const [zoom, setZoom] = useState(100);
  const [onePage, setOnePage] = useState(false);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(null);
  const [isPreFlightOpen, setIsPreFlightOpen] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  if (!resume) return <div className="p-8 text-center">Loading resume form...</div>;

  // Form field update handlers
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await api.generateAISummary({
        education: resume.education,
        skills: resume.skills?.languages,
        projects: resume.projects,
        targetRole: resume.targetRole
      });
      setResume(prev => ({ ...prev, summary: res.summary }));
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Education list handlers
  const addEducation = () => {
    const newEdu = { id: `edu_${Date.now()}`, degree: 'B.Tech IT', institution: 'College Name', year: '2022 - 2026', cgpa: '8.5 CGPA' };
    setResume(prev => ({ ...prev, education: [...(prev.education || []), newEdu] }));
  };

  const removeEducation = (id) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  // Project list handlers
  const addProject = () => {
    const newProj = { id: `proj_${Date.now()}`, name: 'New Project', role: 'Developer', technologies: ['Java', 'SQL'], description: 'Developed application module.' };
    setResume(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
  };

  const removeProject = (id) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => {
      const updated = [...prev.projects];
      if (field === 'technologies') {
        updated[index][field] = value.split(',').map(s => s.trim());
      } else {
        updated[index][field] = value;
      }
      return { ...prev, projects: updated };
    });
  };

  // Insert generated AI bullet into project description
  const handleInsertBullet = (bulletText) => {
    if (activeProjectIdx !== null && resume.projects?.[activeProjectIdx]) {
      setResume(prev => {
        const updated = [...prev.projects];
        const currentDesc = updated[activeProjectIdx].description || '';
        updated[activeProjectIdx].description = currentDesc ? `${currentDesc} ${bulletText}` : bulletText;
        return { ...prev, projects: updated };
      });
    }
  };

  const formTabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'summary', label: 'Summary' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Template Selector */}
        <div className="flex items-center space-x-2">
          <Layout className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Template:</span>
          <select
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setResume(prev => ({ ...prev, template: e.target.value }));
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="modern">Modern (Default)</option>
            <option value="professional">Professional ATS</option>
            <option value="minimal">Minimalist Clean</option>
            <option value="fresher">Fresher Student</option>
            <option value="software_developer">Software Developer</option>
            <option value="academic">Academic & Research</option>
          </select>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setZoom(z => Math.max(70, z - 10))} className="p-1 text-slate-600 hover:text-slate-900">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-1">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-1 text-slate-600 hover:text-slate-900">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onePage}
              onChange={(e) => setOnePage(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>One-Page Mode</span>
          </label>

          <button
            onClick={() => setIsPreFlightOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF / DOCX</span>
          </button>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Resume Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          
          {/* Form Tabs */}
          <div className="flex overflow-x-auto pb-2 border-b border-slate-100 space-x-1 no-scrollbar">
            {formTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-600 border border-brand-200'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Personal Information</h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo?.fullName || ''}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Email</label>
                  <input
                    type="email"
                    value={resume.personalInfo?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Phone</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">GitHub Profile</label>
                  <input
                    type="text"
                    value={resume.personalInfo?.github || ''}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Professional Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Professional Summary</h4>
                <button
                  onClick={handleAISummary}
                  disabled={generatingSummary}
                  className="px-2.5 py-1 bg-lavender-100 hover:bg-lavender-200 text-lavender-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  {generatingSummary ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-lavender-600" />}
                  <span>AI Summary</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={resume.summary || ''}
                onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Detail-oriented Information Technology student..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
              />
            </div>
          )}

          {/* Tab 3: Education */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Education Entries</h4>
                <button onClick={addEducation} className="text-xs font-bold text-brand-600 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Entry
                </button>
              </div>
              {(resume.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    placeholder="Degree"
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].degree = e.target.value;
                      setResume(prev => ({ ...prev, education: updated }));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                  />
                  <input
                    type="text"
                    value={edu.institution || ''}
                    placeholder="Institution"
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[idx].institution = e.target.value;
                      setResume(prev => ({ ...prev, education: updated }));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.year || ''}
                      placeholder="Year"
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].year = e.target.value;
                        setResume(prev => ({ ...prev, education: updated }));
                      }}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      value={edu.cgpa || ''}
                      placeholder="CGPA / Grade"
                      onChange={(e) => {
                        const updated = [...resume.education];
                        updated[idx].cgpa = e.target.value;
                        setResume(prev => ({ ...prev, education: updated }));
                      }}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Skills Categorization</h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Programming Languages (Comma separated)</label>
                <input
                  type="text"
                  value={resume.skills?.languages?.join(', ') || ''}
                  onChange={(e) => {
                    const val = e.target.value.split(',').map(s => s.trim());
                    setResume(prev => ({ ...prev, skills: { ...prev.skills, languages: val } }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={resume.skills?.frameworks?.join(', ') || ''}
                  onChange={(e) => {
                    const val = e.target.value.split(',').map(s => s.trim());
                    setResume(prev => ({ ...prev, skills: { ...prev.skills, frameworks: val } }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Databases & Cloud</label>
                <input
                  type="text"
                  value={resume.skills?.databases?.join(', ') || ''}
                  onChange={(e) => {
                    const val = e.target.value.split(',').map(s => s.trim());
                    setResume(prev => ({ ...prev, skills: { ...prev.skills, databases: val } }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Projects</h4>
                <button onClick={addProject} className="text-xs font-bold text-brand-600 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {(resume.projects || []).map((proj, idx) => (
                <div key={proj.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    value={proj.name || ''}
                    placeholder="Project Name"
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                  />

                  <input
                    type="text"
                    value={proj.technologies?.join(', ') || ''}
                    placeholder="Technologies (Java, Spring Boot, MySQL)"
                    onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-500">DESCRIPTION</label>
                      <button
                        onClick={() => {
                          setActiveProjectIdx(idx);
                          setIsBulletModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-brand-600 flex items-center gap-1 hover:underline"
                      >
                        <Sparkles className="w-3 h-3" /> AI Bullet Generator
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={proj.description || ''}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 6: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Internship / Experience</h4>
              {(resume.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={exp.role || ''}
                    placeholder="Role"
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx].role = e.target.value;
                      setResume(prev => ({ ...prev, experience: updated }));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                  />
                  <input
                    type="text"
                    value={exp.organization || ''}
                    placeholder="Organization / Company"
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx].organization = e.target.value;
                      setResume(prev => ({ ...prev, experience: updated }));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                  <textarea
                    rows={2}
                    value={exp.description || ''}
                    onChange={(e) => {
                      const updated = [...resume.experience];
                      updated[idx].description = e.target.value;
                      setResume(prev => ({ ...prev, experience: updated }));
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab 7 & 8: Certifications & Achievements */}
          {(activeTab === 'certifications' || activeTab === 'achievements') && (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              Certifications & Achievements pre-synced with Career Vault. Edit item details in Career Vault tab for ground truth verification.
            </div>
          )}

          {/* Real-Time Truth Guard Component */}
          <TruthGuardBadge report={truthStatus} />

        </div>

        {/* RIGHT COLUMN: Live Resume Preview (7 cols) */}
        <div className="lg:col-span-7 sticky top-20">
          <ResumePreview
            resume={resume}
            template={template}
            zoom={zoom}
            onePage={onePage}
          />
        </div>

      </div>

      {/* AI Bullet Modal */}
      <BulletGeneratorModal
        isOpen={isBulletModalOpen}
        onClose={() => setIsBulletModalOpen(false)}
        onInsert={handleInsertBullet}
      />

      {/* Pre-Flight Export Audit Modal */}
      <PreFlightModal
        isOpen={isPreFlightOpen}
        onClose={() => setIsPreFlightOpen(false)}
        resume={resume}
      />

    </div>
  );
}
