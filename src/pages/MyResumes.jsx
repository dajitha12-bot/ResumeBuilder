import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  Check, 
  Sparkles,
  Search,
  ExternalLink,
  X
} from 'lucide-react';
import { exportToPDF, exportToDOCX } from '../utils/exportUtils';
import { api } from '../services/api';

export default function MyResumes({ resume, setResume, versions = [], setVersions, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('Full Stack Software Engineer');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingVer, setEditingVer] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredVersions = versions.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.targetRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!newResumeName.trim()) return;

    try {
      const created = await api.createResume({
        userId: 'user_001',
        title: newResumeName.trim(),
        targetRole: newTargetRole,
        template: 'modern',
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        experience: resume.experience,
        certifications: resume.certifications,
        achievements: resume.achievements
      });

      const newVerObj = {
        id: `ver_${Date.now()}`,
        userId: 'user_001',
        name: created.title,
        targetRole: created.targetRole,
        template: created.template,
        resumeId: created.id,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setVersions(prev => [newVerObj, ...prev]);
      setResume(created);
      setIsCreateModalOpen(false);
      setNewResumeName('');
      onNavigate('builder');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRename = () => {
    if (!renameValue.trim() || !editingVer) return;

    setVersions(prev => prev.map(v => v.id === editingVer.id ? { ...v, name: renameValue.trim() } : v));
    if (resume.title === editingVer.name) {
      setResume(prev => ({ ...prev, title: renameValue.trim() }));
    }
    setIsRenameModalOpen(false);
    setEditingVer(null);
  };

  const handleDuplicate = (ver) => {
    const duplicated = {
      ...ver,
      id: `ver_${Date.now()}`,
      name: `${ver.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVersions(prev => [duplicated, ...prev]);
  };

  const handleDelete = (id) => {
    if (versions.length <= 1) {
      alert('You must keep at least one active resume version.');
      return;
    }
    setVersions(prev => prev.filter(v => v.id !== id));
  };

  const handleOpenResume = (ver) => {
    setResume(prev => ({
      ...prev,
      title: ver.name,
      targetRole: ver.targetRole,
      template: ver.template || 'modern'
    }));
    onNavigate('builder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Main Resume Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-xs text-slate-500">Manage all your resume documents in one place with FlowCV-style editing, duplicating, and exporting.</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resume name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
          Saved Resumes: <strong className="text-slate-900">{filteredVersions.length}</strong>
        </span>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVersions.map(ver => (
          <div key={ver.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                  {ver.template || 'Modern'} Template
                </span>
                <span className="text-[10px] font-medium text-slate-400">{ver.createdAt}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
                  <span>{ver.name}</span>
                  <button 
                    onClick={() => {
                      setEditingVer(ver);
                      setRenameValue(ver.name);
                      setIsRenameModalOpen(true);
                    }} 
                    className="text-slate-400 hover:text-brand-600"
                    title="Rename Resume"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </h3>
                <p className="text-xs font-semibold text-brand-600">{ver.targetRole}</p>
              </div>
            </div>

            {/* Resume Card Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button
                onClick={() => handleOpenResume(ver)}
                className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm flex-1 justify-center"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Editor</span>
              </button>

              <button
                onClick={() => handleDuplicate(ver)}
                title="Duplicate Version"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => exportToPDF(resume, `${ver.name}.pdf`)}
                title="Download PDF"
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(ver.id)}
                title="Delete Version"
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Create New Resume (Asks for Resume Name First) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create New Resume</h3>
              <button onClick={() => setIsCreateModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resume / File Name (Required)</label>
                <input
                  type="text"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  placeholder="e.g. Java Developer Resume, Full Stack Resume"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Role Position</label>
                <input
                  type="text"
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateNew}
              disabled={!newResumeName.trim()}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Create Resume & Open Editor
            </button>
          </div>
        </div>
      )}

      {/* Modal: Rename Resume */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Rename Resume</h3>
              <button onClick={() => setIsRenameModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-bold"
            />

            <button
              onClick={handleRename}
              className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Save New Name
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
