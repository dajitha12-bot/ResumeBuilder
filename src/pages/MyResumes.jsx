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
  ExternalLink
} from 'lucide-react';
import { exportToPDF, exportToDOCX } from '../utils/exportUtils';
import { api } from '../services/api';

export default function MyResumes({ resume, setResume, versions = [], setVersions, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredVersions = versions.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.targetRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = async () => {
    const newTitle = prompt('Enter title for new resume version:', 'Full Stack Web Resume');
    if (!newTitle) return;

    try {
      const created = await api.createResume({
        userId: 'user_001',
        title: newTitle,
        targetRole: 'Full Stack Engineer',
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

      setVersions(prev => [...prev, {
        id: `ver_${Date.now()}`,
        userId: 'user_001',
        name: created.title,
        targetRole: created.targetRole,
        template: created.template,
        resumeId: created.id,
        createdAt: new Date().toISOString().split('T')[0]
      }]);
      setResume(created);
      onNavigate('builder');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = (ver) => {
    const duplicated = {
      ...ver,
      id: `ver_${Date.now()}`,
      name: `${ver.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVersions(prev => [...prev, duplicated]);
  };

  const handleDelete = (id) => {
    if (versions.length <= 1) {
      alert('You must keep at least one active resume version.');
      return;
    }
    setVersions(prev => prev.filter(v => v.id !== id));
  };

  const handleSelectResume = (ver) => {
    setResume(prev => ({
      ...prev,
      title: ver.name,
      targetRole: ver.targetRole,
      template: ver.template
    }));
    onNavigate('builder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Multi-Version Resume Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-xs text-slate-500">Create, customize, duplicate, and manage targeted resume versions for different job applications.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resume versions..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
          Total Versions: <strong className="text-slate-900">{filteredVersions.length}</strong>
        </span>
      </div>

      {/* Versions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVersions.map(ver => (
          <div key={ver.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                  {ver.template} Template
                </span>
                <span className="text-[10px] font-medium text-slate-400">{ver.createdAt}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{ver.name}</h3>
              <p className="text-xs font-semibold text-brand-600">{ver.targetRole}</p>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSelectResume(ver)}
                className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm flex-1 justify-center"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDuplicate(ver)}
                title="Duplicate Version"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                <Copy className="w-4 h-4" />
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

    </div>
  );
}
