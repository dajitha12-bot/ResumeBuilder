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
  Info
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import BulletGeneratorModal from '../components/BulletGeneratorModal';
import PreFlightModal from '../components/PreFlightModal';
import CustomizeTab from '../components/CustomizeTab';
import AIToolsTab from '../components/AIToolsTab';
import { exportToPDF, exportToDOCX } from '../utils/exportUtils';
import { api } from '../services/api';

export default function ResumeBuilder({ resume, setResume, truthStatus, versions = [], setVersions }) {
  const [editorSubTab, setEditorSubTab] = useState('content'); // 'overview' | 'content' | 'customize' | 'ai-tools'
  const [activeSection, setActiveSection] = useState('personal');
  const [zoom, setZoom] = useState(100);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(null);
  const [isPreFlightOpen, setIsPreFlightOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [customizeOptions, setCustomizeOptions] = useState({
    fontFamily: 'Inter',
    fontSize: '11px',
    headingStyle: 'solid_bar',
    lineSpacing: '1.4',
    sectionSpacing: '12px',
    margins: '0.4in',
    accentColor: '#3b82f6',
    onePage: true
  });

  if (!resume) return <div className="p-8 text-center text-slate-400">Loading Resume Editor...</div>;

  // Form field updaters
  const updatePersonalInfo = (field, val) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val }
    }));
  };

  const handleSelectVersion = (verId) => {
    const selectedVer = versions.find(v => v.id === verId || v.resumeId === verId);
    if (selectedVer) {
      setResume(prev => ({
        ...prev,
        title: selectedVer.name,
        targetRole: selectedVer.targetRole,
        template: selectedVer.template || 'modern'
      }));
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

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      
      {/* FlowCV-Style Top Editor Navbar Header */}
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
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Header: Resume Name Dropdown & Download Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* Resume Name Selector Dropdown */}
          <select
            value={resume.id || 'resume_001'}
            onChange={(e) => handleSelectVersion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-500 max-w-[200px] truncate"
          >
            {versions.length > 0 ? (
              versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))
            ) : (
              <option value="resume_001">{resume.title || 'Java Developer Resume'}</option>
            )}
          </select>

          {/* Download Button */}
          <button
            onClick={() => setIsPreFlightOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
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
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{resume.title || 'Java Developer Resume'}</h4>
                <p className="text-slate-600">Target Role: <strong>{resume.targetRole || 'Software Engineer'}</strong></p>
                <p className="text-slate-500 text-[11px]">Template: <strong>{resume.template || 'Modern'}</strong></p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Sections Checklist (12/12 Available)</h5>
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

          {/* Sub-Tab 2: Content (12 Sections Editor) */}
          {editorSubTab === 'content' && (
            <div className="space-y-4">
              
              {/* Section Selector Pills */}
              <div className="flex overflow-x-auto pb-2 border-b border-slate-100 space-x-1.5 no-scrollbar">
                {sectionsList.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeSection === sec.id
                        ? 'bg-brand-50 text-brand-600 border border-brand-200'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {sec.name}
                  </button>
                ))}
              </div>

              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Personal Information</h4>
                  <input
                    type="text"
                    value={resume.personalInfo?.fullName || ''}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"
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
                    placeholder="Location (City, Country)"
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
                </div>
              )}

              {/* Summary */}
              {activeSection === 'summary' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Professional Summary</h4>
                  <textarea
                    rows={6}
                    value={resume.summary || ''}
                    onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Write a concise professional summary..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none leading-relaxed"
                  />
                </div>
              )}

              {/* Education */}
              {activeSection === 'education' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Education Entries</h4>
                    <button 
                      onClick={() => {
                        const newEdu = { id: `edu_${Date.now()}`, degree: 'B.Tech IT', institution: 'College Name', year: '2022 - 2026', cgpa: '8.5 CGPA' };
                        setResume(prev => ({ ...prev, education: [...(prev.education || []), newEdu] }));
                      }}
                      className="text-xs font-bold text-brand-600 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {(resume.education || []).map((edu, idx) => (
                    <div key={edu.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600"
                      >
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

              {/* Skills */}
              {activeSection === 'skills' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Technical Skills</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Programming Languages</label>
                    <input
                      type="text"
                      value={resume.skills?.languages?.join(', ') || ''}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map(s => s.trim());
                        setResume(prev => ({ ...prev, skills: { ...prev.skills, languages: val } }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeSection === 'projects' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Projects</h4>
                    <button 
                      onClick={() => {
                        const newProj = { id: `proj_${Date.now()}`, name: 'New Project', role: 'Developer', technologies: ['Java', 'SQL'], description: 'Project description.' };
                        setResume(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
                      }}
                      className="text-xs font-bold text-brand-600 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {(resume.projects || []).map((proj, idx) => (
                    <div key={proj.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                      <button 
                        onClick={() => {
                          setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }));
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={proj.name || ''}
                        placeholder="Project Name"
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[idx].name = e.target.value;
                          setResume(prev => ({ ...prev, projects: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        value={proj.technologies?.join(', ') || ''}
                        placeholder="Technologies used"
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[idx].technologies = e.target.value.split(',').map(s=>s.trim());
                          setResume(prev => ({ ...prev, projects: updated }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                      />
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500">DESCRIPTION</label>
                        <button
                          onClick={() => {
                            setActiveProjectIdx(idx);
                            setIsBulletModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-brand-600 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> AI Bullet Generator
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={proj.description || ''}
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

              {/* Areas of Interest, Languages, Links */}
              {['interests', 'positions', 'languages', 'links'].includes(activeSection) && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p className="font-bold text-slate-900 mb-1">Section Pre-synced</p>
                  Additional section data populated from Career Vault proof trees. Edit details in Career Vault tab for instant updates.
                </div>
              )}

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
                <button onClick={() => setZoom(z => Math.max(70, z - 10))} className="p-1 text-slate-600 hover:text-slate-900">
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold px-1 text-slate-800">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-1 text-slate-600 hover:text-slate-900">
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsPreFlightOpen(true)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <ResumePreview
            resume={resume}
            template={resume.template || 'modern'}
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
