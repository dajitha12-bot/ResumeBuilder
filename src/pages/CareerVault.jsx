import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Award, 
  Briefcase, 
  Code, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import EvidenceGraph from '../components/EvidenceGraph';
import { api } from '../services/api';

export default function CareerVault({ vaultItems = [], setVaultItems }) {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState('Java');
  const [evidenceData, setEvidenceData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'project',
    description: '',
    skills: '',
    technologies: '',
    evidence: '',
    source: 'Academic Project'
  });

  // Filter items
  const filteredItems = vaultItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = !searchTerm || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleShowEvidence = async (skill) => {
    setSelectedSkillForEvidence(skill);
    try {
      const res = await api.getSkillEvidence('user_001', skill);
      setEvidenceData(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title) return;
    try {
      const added = await api.addVaultItem({
        userId: 'user_001',
        title: newItem.title,
        type: newItem.type,
        description: newItem.description,
        skills: newItem.skills.split(',').map(s => s.trim()),
        technologies: newItem.technologies.split(',').map(t => t.trim()),
        evidence: newItem.evidence,
        source: newItem.source
      });
      setVaultItems(prev => [added, ...prev]);
      setIsModalOpen(false);
      setNewItem({ title: '', type: 'project', description: '', skills: '', technologies: '', evidence: '', source: 'Academic Project' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.deleteVaultItem(id);
      setVaultItems(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-lavender-50 text-lavender-700 text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Career Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Career Vault & Skill Evidence</h1>
          <p className="text-xs text-slate-500">Store and verify all your real projects, internships, and certifications for AI resume tailoring.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Filter Pills */}
        <div className="flex overflow-x-auto space-x-1 w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'project', label: 'Projects' },
            { id: 'internship', label: 'Internships' },
            { id: 'certification', label: 'Certifications' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === f.id
                  ? 'bg-brand-50 text-brand-600 border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills, projects..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

      </div>

      {/* Skill Evidence Tree Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Select Skill to View Evidence Tree</h3>
          <span className="text-xs text-slate-500">Click any skill pill below</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Java', 'Spring Boot', 'SQL', 'React', 'Python', 'REST API', 'C++', 'IoT'].map(skill => (
            <button
              key={skill}
              onClick={() => handleShowEvidence(skill)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedSkillForEvidence === skill
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {evidenceData && (
          <EvidenceGraph evidenceGraph={evidenceData} />
        )}
      </div>

      {/* Vault Items Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Vault Records ({filteredItems.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.type === 'project' ? 'bg-blue-50 text-blue-700' : item.type === 'internship' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.type}
                  </span>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-slate-300 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {(item.skills || []).map((sk, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">{sk}</span>
                  ))}
                </div>
                {item.evidence && (
                  <p className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded font-mono">
                    Proof: {item.evidence}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Career Record</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Smart University Event Management"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value="project">Project</option>
                    <option value="internship">Internship</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source / Institution</label>
                  <input
                    type="text"
                    value={newItem.source}
                    onChange={(e) => setNewItem({ ...newItem, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skills Demonstrated (comma separated)</label>
                <input
                  type="text"
                  value={newItem.skills}
                  onChange={(e) => setNewItem({ ...newItem, skills: e.target.value })}
                  placeholder="Java, Spring Boot, SQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verification Evidence / Proof Link</label>
                <input
                  type="text"
                  value={newItem.evidence}
                  onChange={(e) => setNewItem({ ...newItem, evidence: e.target.value })}
                  placeholder="GitHub repo commit or verified certificate ID"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleAddItem}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Save to Career Vault
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
