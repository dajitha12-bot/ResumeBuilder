import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import CoverLetterPreview from '../components/CoverLetterPreview';

export default function MyCoverLetters({ onNavigate, onEditLetter }) {
  const [coverLetters, setCoverLetters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLetterName, setNewLetterName] = useState('');
  const [editingLetter, setEditingLetter] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = () => {
    const list = StorageService.getCollection('cover_letters');
    setCoverLetters(list);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newLetterName.trim()) return;

    const newRecord = StorageService.createRecord('cover_letters', {
      name: newLetterName.trim(),
      template: 'desert_rock',
      sender: {
        fullName: 'Ajitha D R',
        jobTitle: 'B.Tech – Information Technology',
        email: 'dajitha12@gmail.com',
        phone: '6374784776',
        location: 'Aruppukottai, Virudhunagar District, Tamil Nadu',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ajitha',
        linkedin: 'linkedin.com/in/ajitha-d-r-b3697b323',
        github: 'https://github.com/dajitha12-bot'
      },
      recipient: {
        hiringManager: 'Hiring Manager',
        company: 'Target Company',
        address: 'Company Location, Country',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      },
      salutation: 'Dear Hiring Manager,',
      opening: 'I am excited to apply for the position at your company. With a strong background in software engineering and web development, I am confident in my ability to add immediate value to your team.',
      body: [
        'Throughout my academic career at National Engineering College, I have gained hands-on experience in building modern web applications, scalable backend APIs, and responsive UI components.',
        'I am impressed by your company\'s commitment to innovation and look forward to contributing my technical skills and enthusiasm to your projects.'
      ],
      closing: 'Thank you for considering my application. I welcome the opportunity to discuss my qualifications further in an interview.',
      signoff: 'Sincerely,',
      signature: 'Ajitha D R'
    }, 'cl');

    setIsModalOpen(false);
    setNewLetterName('');
    if (onEditLetter) onEditLetter(newRecord.id);
    if (onNavigate) onNavigate('cover-letter-builder');
  };

  const handleOpenLetter = (id) => {
    if (onEditLetter) onEditLetter(id);
    if (onNavigate) onNavigate('cover-letter-builder');
  };

  const handleDuplicate = (letter, e) => {
    e.stopPropagation();
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
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      StorageService.deleteById('cover_letters', id);
      loadLetters();
    }
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (!editingLetter || !newLetterName.trim()) return;

    StorageService.updateById('cover_letters', editingLetter.id, {
      name: newLetterName.trim()
    });
    setRenameModalOpen(false);
    setEditingLetter(null);
    setNewLetterName('');
    loadLetters();
  };

  const openRenameModal = (letter, e) => {
    e.stopPropagation();
    setEditingLetter(letter);
    setNewLetterName(letter.name);
    setRenameModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            ✉️ My Cover Letters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, customize, and export professional FlowCV-style cover letters.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create New Cover Letter
        </button>
      </div>

      {/* Grid of Cover Letters */}
      {coverLetters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✉️
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Cover Letters Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Build your first tailored cover letter matching your resume design.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow transition"
          >
            Create First Cover Letter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter.id)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="h-64 bg-slate-50 p-4 relative overflow-hidden flex justify-center border-b border-slate-100">
                <div className="transform scale-[0.35] origin-top w-[800px] pointer-events-none select-none shadow-sm">
                  <CoverLetterPreview data={letter} template={letter.template || 'desert_rock'} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="px-4 py-2 bg-slate-900/80 text-white font-medium text-xs rounded-lg backdrop-blur shadow">
                    Click to Edit ✏️
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-5 flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-sky-600 transition truncate max-w-[200px]">
                      {letter.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target: <span className="font-semibold text-slate-600">{letter.recipient?.company || 'General'}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-sky-50 text-sky-700 border border-sky-100">
                    {letter.template || 'desert_rock'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Updated {letter.updatedAt || letter.createdAt || 'Recently'}</span>
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => openRenameModal(letter, e)}
                      title="Rename"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 font-medium"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(letter, e)}
                      title="Duplicate"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 font-medium"
                    >
                      📋
                    </button>
                    <button
                      onClick={(e) => handleDelete(letter.id, e)}
                      title="Delete"
                      className="p-1.5 hover:bg-red-50 rounded text-red-600 font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">Create New Cover Letter</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cover Letter Name / Target Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer - Google"
                  value={newLetterName}
                  onChange={(e) => setNewLetterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow"
                >
                  Create & Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">Rename Cover Letter</h3>
              <button onClick={() => setRenameModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Letter Name</label>
                <input
                  type="text"
                  value={newLetterName}
                  onChange={(e) => setNewLetterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
