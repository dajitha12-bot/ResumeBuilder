import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Edit3, Copy, Trash2, Download, FileText } from 'lucide-react';
import { StorageService } from '../services/storageService';
import CoverLetterPreview from '../components/CoverLetterPreview';
import { exportToPDF } from '../utils/exportUtils';

export default function MyCoverLetters({ onNavigate, onEditLetter }) {
  const [coverLetters, setCoverLetters] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = () => {
    const list = StorageService.getCollection('cover_letters');
    setCoverLetters(list);
  };

  const handleOpenLetter = (id) => {
    if (onEditLetter) onEditLetter(id);
    if (onNavigate) onNavigate('cover-letter-builder');
  };

  const handleDuplicate = (letter, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const duplicated = {
      ...letter,
      id: undefined,
      name: `${letter.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    StorageService.createRecord('cover_letters', duplicated, 'cl');
    loadLetters();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      StorageService.deleteById('cover_letters', id);
      loadLetters();
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (!editingLetter || !renameValue.trim()) return;

    StorageService.updateById('cover_letters', editingLetter.id, {
      name: renameValue.trim()
    });
    setIsRenameModalOpen(false);
    setEditingLetter(null);
    setRenameValue('');
    loadLetters();
  };

  const openRenameModal = (letter, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingLetter(letter);
    setRenameValue(letter.name);
    setIsRenameModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50/50 min-h-screen">
      
      {/* FlowCV Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Cover Letters</h1>
        <p className="text-sm text-slate-500 font-medium">
          Your cover letters are 100% free forever with unlimited downloads.
        </p>
      </div>

      {/* Cover Letters Grid: Dashed "+ New cover letter" Card First, then Saved Letters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Dashed "+ New cover letter" Card */}
        <div
          onClick={() => onNavigate && onNavigate('templates', 'cover_letters')}
          className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl bg-white hover:bg-sky-50/30 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[420px] p-6 text-slate-500 hover:text-sky-600 group shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition mb-3">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="font-bold text-base text-slate-700 group-hover:text-sky-600 transition">
            New cover letter
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Choose template to create
          </span>
        </div>

        {/* Saved Cover Letter Cards */}
        {coverLetters.map((letter) => (
          <div
            key={letter.id}
            onClick={() => handleOpenLetter(letter.id)}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group overflow-hidden relative"
          >
            {/* Live Scaled Document Preview Box */}
            <div className="h-80 bg-[#f8f9fa] p-4 relative overflow-hidden flex justify-center border-b border-slate-100 items-start">
              <div className="transform scale-[0.32] origin-top w-[800px] pointer-events-none select-none shadow-md rounded border border-slate-200">
                <CoverLetterPreview data={letter} template={letter.template || 'modern_blue'} />
              </div>
              
              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="px-5 py-2.5 bg-slate-900/80 text-white font-bold text-xs rounded-xl shadow-lg backdrop-blur">
                  Edit Cover Letter ✏️
                </span>
              </div>
            </div>

            {/* Card Footer Caption (Exact FlowCV Screenshot Layout) */}
            <div className="p-4 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition truncate max-w-[200px]">
                  {letter.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  edited {letter.updatedAt || letter.createdAt || 'recently'} • A4
                </p>
              </div>

              {/* 3-Dots Action Menu Button */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveMenuId(activeMenuId === letter.id ? null : letter.id)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {activeMenuId === letter.id && (
                  <div className="absolute right-0 bottom-10 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in duration-100">
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        handleOpenLetter(letter.id);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" /> Open Editor
                    </button>
                    <button
                      onClick={(e) => openRenameModal(letter, e)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" /> Rename
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(letter, e)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" /> Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        setActiveMenuId(null);
                        exportToPDF('cover-letter-preview', `${letter.name}.pdf`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" /> Download PDF
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={(e) => handleDelete(letter.id, e)}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Modal: Rename Cover Letter */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-slate-900 text-sm">Rename Cover Letter</h3>
              <button onClick={() => setIsRenameModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
