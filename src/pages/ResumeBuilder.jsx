import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  Printer, 
  Check, 
  Layers, 
  Palette, 
  Bot,
  Info,
  Save,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import BulletGeneratorModal from '../components/BulletGeneratorModal';
import PreFlightModal from '../components/PreFlightModal';
import CustomizeTab from '../components/CustomizeTab';
import AIToolsTab from '../components/AIToolsTab';
import { exportToPDF, exportToDOCX } from '../utils/exportUtils';
import { api } from '../services/api';
import { StorageService } from '../services/storageService';

export default function ResumeBuilder({ resume, setResume, truthStatus, versions = [], setVersions }) {
  const [editorSubTab, setEditorSubTab] = useState('content'); // 'overview' | 'content' | 'customize' | 'ai-tools'
  const [activeSection, setActiveSection] = useState('personal');
  const [zoom, setZoom] = useState(100);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(null);
  const [isPreFlightOpen, setIsPreFlightOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [customizeOptions, setCustomizeOptions] = useState({
    fontFamily: 'Inter',
    fontSize: '11px',
    headingStyle: 'solid_bar',
    lineSpacing: '1.4',
    sectionSpacing: '12px',
    margins: '0.4in',
    accentColor: '#0284c7',
    onePage: true
  });

  if (!resume) return <div className="p-8 text-center text-slate-400">Loading Resume Editor...</div>;

  // Save Handler
  const handleSaveResume = () => {
    if (!resume) return;

    const currentId = resume.id || `ver_${Date.now()}`;
    const fullName = resume.personalInfo?.fullName?.trim();
    const updatedName = resume.title && resume.title !== 'New Resume' && resume.title !== 'Untitled Resume'
      ? resume.title
      : (fullName ? `${fullName}'s Resume` : 'My Resume');

    const updatedVer = {
      id: currentId,
      resumeId: currentId,
      name: updatedName,
      targetRole: resume.targetRole || resume.personalInfo?.subtitle || 'Software Engineer',
      template: resume.template || 'classic_serif',
      createdAt: resume.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      data: { ...resume, id: currentId, title: updatedName }
    };

    if (setVersions) {
      setVersions(prev => {
        const exists = prev.some(v => v.id === currentId || v.resumeId === currentId);
        if (exists) {
          return prev.map(v => (v.id === currentId || v.resumeId === currentId) ? updatedVer : v);
        } else {
          return [updatedVer, ...prev];
        }
      });
    }

    StorageService.createRecord('resumes', resume, 'resume');
    StorageService.saveCollection('resume_versions', versions.length ? versions.map(v => (v.id === currentId ? updatedVer : v)) : [updatedVer]);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Form field updaters
  const updatePersonalInfo = (field, val) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...(prev.personalInfo || {}), [field]: val }
    }));
  };

  const handleSelectVersion = (verId) => {
    const selectedVer = versions.find(v => v.id === verId || v.resumeId === verId);
    if (selectedVer) {
      if (selectedVer.data) {
        setResume(selectedVer.data);
      } else {
        setResume(prev => ({
          ...prev,
          id: selectedVer.id,
          title: selectedVer.name,
          targetRole: selectedVer.targetRole,
          template: selectedVer.template || 'classic_serif'
        }));
      }
    }
  };

  const sectionsList = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'summary', name: 'Professional Summary' },
    { id: 'education', name: 'Education' },
    { id: 'skills', name: 'Technical Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'experience', name: 'Internships / Experience' },
    { id: 'certifications', name: 'Certifications & Courses' },
    { id: 'achievements', name: 'Achievements & Awards' },
    { id: 'interests', name: 'Areas of Interest' },
    { id: 'positions', name: 'Positions & Activities' },
    { id: 'languages', name: 'Languages Known' },
    { id: 'links', name: 'Links & Profiles' }
  ];

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

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await api.generateAISummary(resume);
      if (res?.summary) {
        setResume(prev => ({ ...prev, summary: res.summary }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      
      {/* FlowCV Top Editor Navbar Header */}
      <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Editor Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b md:border-b-0 border-slate-100 pb-2 md:pb-0 w-full md:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'content', label: 'Content', icon: Edit3 },
            { id: 'customize', label: 'Customize', icon: Palette },
            { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = editorSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEditorSubTab(tab.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Header: Save Resume, Version Selector & Download Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end flex-wrap gap-y-2">
          
          {/* Save Resume Button */}
          <button
            onClick={handleSaveResume}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer ${
              saveSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20'
            }`}
          >
            {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveSuccess ? 'Saved!' : 'Save Resume'}</span>
          </button>

          {/* Resume Selector Dropdown */}
          <select
            value={resume.id || 'resume_001'}
            onChange={(e) => handleSelectVersion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-sky-500 max-w-[180px] truncate"
          >
            {versions.length > 0 ? (
              versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))
            ) : (
              <option value="resume_001">{resume.title || 'Software Developer Resume'}</option>
            )}
          </select>

          {/* Download Button */}
          <button
            onClick={() => setIsPreFlightOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs space-y-1">
                <button
                  onClick={() => {
                    window.print();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 font-medium"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Resume</span>
                </button>
                <button
                  onClick={() => {
                    exportToDOCX(resume, `${resume.title || 'Resume'}.docx`);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export DOCX</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main FlowCV-Style Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Section Controls & Sub-Tab Editor (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          
          {/* Sub-Tab 1: Overview */}
          {editorSubTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{resume.title || 'Software Developer Resume'}</h4>
                <p className="text-slate-600">Target Role: <strong>{resume.targetRole || 'Software Engineer'}</strong></p>
                <p className="text-slate-500 text-[11px]">Template: <strong>{resume.template || 'Classic Serif'}</strong></p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Sections Checklist (12/12 Fully Editable)</h5>
                <div className="grid grid-cols-2 gap-2">
                  {sectionsList.map(s => (
                    <div key={s.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center space-x-2 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Content (12 Full Editable Sections) */}
          {editorSubTab === 'content' && (
            <div className="space-y-4">
              
              {/* Section Selector Pills */}
              <div className="flex overflow-x-auto pb-2 border-b border-slate-100 space-x-1.5 no-scrollbar">
                {sectionsList.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-sky-50 text-sky-600 border border-sky-200'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>

              {/* 1. PERSONAL INFORMATION */}
              {activeSection === 'personal' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Personal Information</h4>
                  
                  {/* Photo Upload */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Profile Photo Upload</label>
                    <div className="flex items-center space-x-3">
                      {(resume.personalInfo?.avatarUrl || resume.personalInfo?.avatar) ? (
                        <img src={resume.personalInfo?.avatarUrl || resume.personalInfo?.avatar} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-400 bg-sky-50 flex items-center justify-center text-sky-600 text-xs font-bold shrink-0">
                          📷
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updatePersonalInfo('avatarUrl', reader.result);
                                updatePersonalInfo('avatar', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
                        />
                        {(resume.personalInfo?.avatarUrl || resume.personalInfo?.avatar) && (
                          <button
                            type="button"
                            onClick={() => {
                              updatePersonalInfo('avatarUrl', '');
                              updatePersonalInfo('avatar', '');
                            }}
                            className="text-[10px] text-red-500 hover:underline block font-semibold cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="Full Name (e.g. Ajitha D R)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    value={resume.personalInfo?.subtitle || ''}
                    onChange={(e) => updatePersonalInfo('subtitle', e.target.value)}
                    placeholder="Target Role / Degree (e.g. B.Tech – Information Technology)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={resume.personalInfo?.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      value={resume.personalInfo?.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={resume.personalInfo?.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="Location (e.g. Aruppukottai, Virudhunagar, Tamil Nadu)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={resume.personalInfo?.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      value={resume.personalInfo?.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="GitHub URL"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={resume.personalInfo?.portfolio || ''}
                    onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                    placeholder="Portfolio / Personal Website URL"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              )}

              {/* 2. PROFESSIONAL SUMMARY */}
              {activeSection === 'summary' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Professional Summary</h4>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={generatingSummary}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${generatingSummary ? 'animate-spin' : ''}`} />
                      <span>AI Generate Summary</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={resume.summary || ''}
                    onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Write a concise 3-4 sentence summary of your background, technical skills, and career goals..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none leading-relaxed focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              {/* 3. EDUCATION */}
              {activeSection === 'education' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Education Entries</h4>
                    <button 
                      onClick={() => {
                        const newEdu = { id: `edu_${Date.now()}`, degree: '', institution: '', year: '', details: '' };
                        setResume(prev => ({ ...prev, education: [...(prev.education || []), newEdu] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Education
                    </button>
                  </div>

                  {(resume.education || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No education entries added yet. Click "+ Add Education" to create one.</p>
                  )}

                  {(resume.education || []).map((edu, idx) => (
                    <div key={edu.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        placeholder="Degree / Diploma (e.g. B.Tech – Information Technology)"
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
                        placeholder="College / Institution (e.g. National Engineering College)"
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
                          placeholder="Year / Duration (e.g. 2024 – 2028)"
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[idx].year = e.target.value;
                            setResume(prev => ({ ...prev, education: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={edu.details || edu.cgpa || ''}
                          placeholder="CGPA / Percentage (e.g. CGPA: 8.7)"
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[idx].details = e.target.value;
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

              {/* 4. TECHNICAL SKILLS */}
              {activeSection === 'skills' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Technical Skills</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Programming Languages (Comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(resume.skills?.languages) ? resume.skills.languages.join(', ') : (resume.skills?.languages || '')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setResume(prev => ({ ...prev, skills: { ...prev.skills, languages: val } }));
                      }}
                      placeholder="e.g. Java, JavaScript, Python, C++, SQL"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Frameworks & Libraries (Comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(resume.skills?.frameworks) ? resume.skills.frameworks.join(', ') : (resume.skills?.frameworks || '')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setResume(prev => ({ ...prev, skills: { ...prev.skills, frameworks: val } }));
                      }}
                      placeholder="e.g. React, Spring Boot, Node.js, Tailwind CSS"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Databases & Cloud (Comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(resume.skills?.databases) ? resume.skills.databases.join(', ') : (resume.skills?.databases || '')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setResume(prev => ({ ...prev, skills: { ...prev.skills, databases: val } }));
                      }}
                      placeholder="e.g. MySQL, PostgreSQL, MongoDB, Firebase, AWS"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* 5. PROJECTS */}
              {activeSection === 'projects' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Projects</h4>
                    <button 
                      onClick={() => {
                        const newProj = { id: `proj_${Date.now()}`, name: '', duration: '', technologies: [], description: '' };
                        setResume(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {(resume.projects || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No projects added yet. Click "+ Add Project" to create one.</p>
                  )}

                  {(resume.projects || []).map((proj, idx) => (
                    <div key={proj.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={proj.name || ''}
                        placeholder="Project Name (e.g. AI Resume Builder)"
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[idx].name = e.target.value;
                          setResume(prev => ({ ...prev, projects: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
                          placeholder="Tech Stack (e.g. React, Node.js)"
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[idx].technologies = e.target.value.split(',').map(s=>s.trim()).filter(Boolean);
                            setResume(prev => ({ ...prev, projects: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={proj.duration || ''}
                          placeholder="Duration / Year (e.g. 2026)"
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[idx].duration = e.target.value;
                            setResume(prev => ({ ...prev, projects: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500">DESCRIPTION</label>
                        <button
                          onClick={() => {
                            setActiveProjectIdx(idx);
                            setIsBulletModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-sky-600 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" /> AI Bullet Generator
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={proj.description || ''}
                        placeholder="Describe key achievements, architecture, and impact..."
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[idx].description = e.target.value;
                          setResume(prev => ({ ...prev, projects: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 6. INTERNSHIPS / EXPERIENCE */}
              {activeSection === 'experience' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Internships & Work Experience</h4>
                    <button 
                      onClick={() => {
                        const newExp = { id: `exp_${Date.now()}`, role: '', organization: '', duration: '', location: '', description: '' };
                        setResume(prev => ({ ...prev, experience: [...(prev.experience || []), newExp] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Experience
                    </button>
                  </div>

                  {(resume.experience || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No internship / work experience added yet. Click "+ Add Experience" to create one.</p>
                  )}

                  {(resume.experience || []).map((exp, idx) => (
                    <div key={exp.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={exp.role || ''}
                        placeholder="Role / Title (e.g. Software Developer Intern)"
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].role = e.target.value;
                          setResume(prev => ({ ...prev, experience: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        value={exp.organization || exp.company || ''}
                        placeholder="Company / Organization (e.g. Tech Solutions)"
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[idx].organization = e.target.value;
                          updated[idx].company = e.target.value;
                          setResume(prev => ({ ...prev, experience: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.duration || ''}
                          placeholder="Duration (e.g. May 2025 – Aug 2025)"
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx].duration = e.target.value;
                            setResume(prev => ({ ...prev, experience: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={exp.location || ''}
                          placeholder="Location (e.g. Chennai / Remote)"
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[idx].location = e.target.value;
                            setResume(prev => ({ ...prev, experience: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={exp.description || ''}
                        placeholder="Responsibilities and accomplishments..."
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

              {/* 7. CERTIFICATIONS & COURSES */}
              {activeSection === 'certifications' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Certifications & Courses</h4>
                    <button 
                      onClick={() => {
                        const newCert = { id: `cert_${Date.now()}`, title: '', issuer: '', year: '' };
                        setResume(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Certification
                    </button>
                  </div>

                  {(resume.certifications || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No certifications added yet. Click "+ Add Certification" to create one.</p>
                  )}

                  {(resume.certifications || []).map((cert, idx) => (
                    <div key={cert.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={cert.title || ''}
                        placeholder="Certification Title (e.g. AWS Certified Developer)"
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[idx].title = e.target.value;
                          setResume(prev => ({ ...prev, certifications: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cert.issuer || ''}
                          placeholder="Issuing Organization (e.g. Coursera / Oracle)"
                          onChange={(e) => {
                            const updated = [...resume.certifications];
                            updated[idx].issuer = e.target.value;
                            setResume(prev => ({ ...prev, certifications: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={cert.year || ''}
                          placeholder="Year (e.g. 2026)"
                          onChange={(e) => {
                            const updated = [...resume.certifications];
                            updated[idx].year = e.target.value;
                            setResume(prev => ({ ...prev, certifications: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 8. ACHIEVEMENTS & AWARDS */}
              {activeSection === 'achievements' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Achievements & Awards</h4>
                    <button 
                      onClick={() => {
                        const newAch = { id: `ach_${Date.now()}`, title: '', organization: '', year: '', description: '' };
                        setResume(prev => ({ ...prev, achievements: [...(prev.achievements || []), newAch] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Achievement
                    </button>
                  </div>

                  {(resume.achievements || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No achievements added yet. Click "+ Add Achievement" to create one.</p>
                  )}

                  {(resume.achievements || []).map((ach, idx) => (
                    <div key={ach.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={ach.title || ''}
                        placeholder="Achievement Title (e.g. 1st Place - Smart India Hackathon)"
                        onChange={(e) => {
                          const updated = [...resume.achievements];
                          updated[idx].title = e.target.value;
                          setResume(prev => ({ ...prev, achievements: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={ach.organization || ''}
                          placeholder="Event / Institution"
                          onChange={(e) => {
                            const updated = [...resume.achievements];
                            updated[idx].organization = e.target.value;
                            setResume(prev => ({ ...prev, achievements: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={ach.year || ''}
                          placeholder="Year (e.g. 2025)"
                          onChange={(e) => {
                            const updated = [...resume.achievements];
                            updated[idx].year = e.target.value;
                            setResume(prev => ({ ...prev, achievements: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 9. AREAS OF INTEREST */}
              {activeSection === 'interests' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Areas of Interest</h4>
                  <p className="text-xs text-slate-500">Enter your areas of technical interest, comma separated:</p>
                  <textarea
                    rows={4}
                    value={Array.isArray(resume.interests) ? resume.interests.join(', ') : (resume.interests || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setResume(prev => ({ ...prev, interests: val }));
                    }}
                    placeholder="e.g. Full Stack Web Development, Cloud Computing, Artificial Intelligence, Open Source"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                  />
                </div>
              )}

              {/* 10. POSITIONS & ACTIVITIES */}
              {activeSection === 'positions' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Positions of Responsibility</h4>
                    <button 
                      onClick={() => {
                        const newPos = { id: `pos_${Date.now()}`, role: '', organization: '', duration: '', description: '' };
                        setResume(prev => ({ ...prev, positions: [...(prev.positions || []), newPos] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Position
                    </button>
                  </div>

                  {(resume.positions || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No leadership positions added yet. Click "+ Add Position" to create one.</p>
                  )}

                  {(resume.positions || []).map((pos, idx) => (
                    <div key={pos.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, positions: prev.positions.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={pos.role || ''}
                        placeholder="Leadership Role (e.g. Technical Lead / Vice President)"
                        onChange={(e) => {
                          const updated = [...resume.positions];
                          updated[idx].role = e.target.value;
                          setResume(prev => ({ ...prev, positions: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pos.organization || ''}
                          placeholder="Club / Society / Organization"
                          onChange={(e) => {
                            const updated = [...resume.positions];
                            updated[idx].organization = e.target.value;
                            setResume(prev => ({ ...prev, positions: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                        <input
                          type="text"
                          value={pos.duration || ''}
                          placeholder="Duration (e.g. 2025 – 2026)"
                          onChange={(e) => {
                            const updated = [...resume.positions];
                            updated[idx].duration = e.target.value;
                            setResume(prev => ({ ...prev, positions: updated }));
                          }}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 11. LANGUAGES KNOWN */}
              {activeSection === 'languages' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Languages Known</h4>
                  <p className="text-xs text-slate-500">Enter languages spoken and proficiency level, comma separated:</p>
                  <textarea
                    rows={4}
                    value={Array.isArray(resume.languages) ? resume.languages.join(', ') : (resume.languages || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setResume(prev => ({ ...prev, languages: val }));
                    }}
                    placeholder="e.g. English (Fluent), Tamil (Native), Hindi (Basic)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                  />
                </div>
              )}

              {/* 12. LINKS & PROFILES */}
              {activeSection === 'links' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Links & Coding Profiles</h4>
                    <button 
                      onClick={() => {
                        const newLink = { id: `link_${Date.now()}`, platform: '', url: '' };
                        setResume(prev => ({ ...prev, links: [...(prev.links || []), newLink] }));
                      }}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Profile Link
                    </button>
                  </div>

                  {(resume.links || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No profile links added yet. Click "+ Add Profile Link" to create one.</p>
                  )}

                  {(resume.links || []).map((link, idx) => (
                    <div key={link.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={link.platform || ''}
                        placeholder="Platform Name (e.g. LeetCode / HackerRank / CodeChef)"
                        onChange={(e) => {
                          const updated = [...resume.links];
                          updated[idx].platform = e.target.value;
                          setResume(prev => ({ ...prev, links: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        value={link.url || ''}
                        placeholder="Profile URL (e.g. https://leetcode.com/username)"
                        onChange={(e) => {
                          const updated = [...resume.links];
                          updated[idx].url = e.target.value;
                          setResume(prev => ({ ...prev, links: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Sticky Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSaveResume}
                  className={`w-full py-3 rounded-2xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20'
                  }`}
                >
                  {saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{saveSuccess ? 'Resume Saved Successfully!' : 'Save Resume Data'}</span>
                </button>
              </div>

            </div>
          )}

          {/* Sub-Tab 3: Customize Options */}
          {editorSubTab === 'customize' && (
            <CustomizeTab
              customizeOptions={customizeOptions}
              setCustomizeOptions={setCustomizeOptions}
              resume={resume}
              setResume={setResume}
            />
          )}

          {/* Sub-Tab 4: AI Tools */}
          {editorSubTab === 'ai-tools' && (
            <AIToolsTab
              resume={resume}
              setResume={setResume}
              onOpenBulletModal={() => setIsBulletModalOpen(true)}
            />
          )}

        </div>

        {/* RIGHT COLUMN: Live A4 Printable Preview (7 cols) */}
        <div className="lg:col-span-7 sticky top-20 space-y-3">
          
          {/* Zoom Toolbar */}
          <div className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
            <span className="font-bold text-slate-700">Live A4 Resume Preview</span>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setZoom(z => Math.max(70, z - 10))} className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold px-1 text-slate-800">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsPreFlightOpen(true)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg flex items-center space-x-1 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <ResumePreview
            resume={resume}
            template={resume.template || 'classic_serif'}
            zoom={zoom}
            onePage={customizeOptions.onePage}
            customizeOptions={customizeOptions}
          />
        </div>

      </div>

      {/* AI Bullet Generator Modal */}
      <BulletGeneratorModal
        isOpen={isBulletModalOpen}
        onClose={() => setIsBulletModalOpen(false)}
        onInsert={handleInsertBullet}
      />

      {/* Pre-Flight Quality Check Modal */}
      <PreFlightModal
        isOpen={isPreFlightOpen}
        onClose={() => setIsPreFlightOpen(false)}
        resume={resume}
      />

    </div>
  );
}
