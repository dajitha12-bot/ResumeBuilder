import React, { useState } from 'react';
import { Palette, CheckCircle2, ArrowRight, Mail, FileText } from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function TemplatesPage({ resume, setResume, onNavigate, onEditCoverLetter }) {
  const [activeType, setActiveType] = useState('resumes'); // 'resumes' | 'cover_letters'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLetterTemplate, setSelectedLetterTemplate] = useState(null);
  const [newLetterName, setNewLetterName] = useState('');

  const resumeTemplates = [
    {
      id: 'classic_serif',
      title: 'FlowCV Classic Serif',
      badge: 'Blue Underline Titles',
      desc: 'Serif typography with solid blue underline section headers, photo upload frame, and timeline education.',
      previewBg: 'font-serif bg-white border-b-2 border-sky-600'
    },
    {
      id: 'modern',
      title: 'Modern Single-Column',
      badge: 'FlowCV Default',
      desc: 'Clean single column layout with bold blue titles, pill skill tags, and timeline markers.',
      previewBg: 'bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 border border-sky-100'
    },
    {
      id: 'two_column',
      title: 'FlowCV Two-Column Compact',
      badge: 'Popular Choice',
      desc: 'Side-by-side header layout with dark grey contact sidebar and blue underline sections.',
      previewBg: 'bg-white border-l-4 border-sky-600'
    },
    {
      id: 'minimal',
      title: 'Minimalist Clean',
      badge: 'Whitespace Focus',
      desc: 'Emphasis on clean typography, generous margins, and bullet readability.',
      previewBg: 'bg-slate-50 border border-slate-200'
    },
    {
      id: 'executive',
      title: 'Executive Senior',
      badge: 'Leadership',
      desc: 'Bold left accent bar highlighting target position and key accomplishments.',
      previewBg: 'border-l-4 border-slate-800 bg-slate-50'
    },
    {
      id: 'fresher',
      title: 'Fresher Student Timeline',
      badge: 'College Project Demo',
      desc: 'Highlights education timeline, CGPA, technical skills, and mini-projects first.',
      previewBg: 'bg-sky-50 border border-sky-100'
    },
    {
      id: 'software_developer',
      title: 'Software Developer',
      badge: 'Tech Stack Choice',
      desc: 'Code-centric format highlighting programming languages, microservices, and GitHub links.',
      previewBg: 'border-l-4 border-sky-600 bg-white'
    },
    {
      id: 'creative',
      title: 'Creative Accent',
      badge: 'Modern Pill Style',
      desc: 'Pastel highlights for skills, certifications, and technical domains.',
      previewBg: 'bg-indigo-50 border border-indigo-100'
    },
    {
      id: 'emerald_corporate',
      title: 'Emerald Corporate',
      badge: 'Emerald Green Accent',
      desc: 'Deep emerald section titles with dark slate photo framing and clean typography.',
      previewBg: 'bg-emerald-50/60 border-l-4 border-emerald-600'
    },
    {
      id: 'coral_modern',
      title: 'Coral Pink Modern',
      badge: 'Coral Pink Accent',
      desc: 'Coral pink section headers and sidebar framing for modern tech roles.',
      previewBg: 'bg-rose-50/60 border-l-4 border-rose-500'
    }
  ];

  const coverLetterTemplates = [
    {
      id: 'modern_blue',
      title: 'Modern Sky Blue',
      badge: 'Sky Blue Accent',
      desc: 'Sky blue accent line header, photo upload space, recipient box, and formal typography.',
      previewBg: 'border-t-4 border-sky-600 bg-white'
    },
    {
      id: 'viola_purple',
      title: 'Viola Dark Purple',
      badge: 'Dark Purple Banner',
      desc: 'Dark purple top header band with photo frame & white text; white letter body below.',
      previewBg: 'bg-[#3b1e3e] text-white border border-purple-900'
    },
    {
      id: 'hunter_green',
      title: 'Hunter Sage Green',
      badge: 'Sage Green Sidebar',
      desc: 'Sage green left sidebar for contact details and photo; crisp white letter column right.',
      previewBg: 'bg-[#2b4c3f] text-white border border-[#1e382e]'
    },
    {
      id: 'coral_pink',
      title: 'Coral Pink Accent',
      badge: 'Coral Pink Modern',
      desc: 'Coral pink top header underline and photo frame for modern tech applications.',
      previewBg: 'border-t-4 border-rose-500 bg-white'
    },
    {
      id: 'gold_minimal',
      title: 'Gold Minimal',
      badge: 'Gold Frame',
      desc: 'Gold border frame with top inline header, photo upload frame, and gold accent dividers.',
      previewBg: 'bg-white border-2 border-[#d4af37]'
    },
    {
      id: 'desert_rock',
      title: 'Desert Rock',
      badge: 'Warm Beige Sidebar',
      desc: 'Warm beige left sidebar with photo frame, sender details, and right letter body column.',
      previewBg: 'bg-[#e8e0d5] border border-[#d4c8b8]'
    },
    {
      id: 'executive_classic',
      title: 'Executive Classic',
      badge: 'Formal Serif',
      desc: 'Formal serif typography with centered header for executive applications.',
      previewBg: 'font-serif bg-white border-b border-slate-400'
    },
    {
      id: 'teal_slate',
      title: 'Teal Slate Split',
      badge: 'Teal Split Column',
      desc: 'Dark teal left sidebar with contact details and photo; clean main body right.',
      previewBg: 'bg-teal-900 text-white border border-teal-950'
    },
    {
      id: 'corporate_navy',
      title: 'Corporate Dark Navy',
      badge: 'Navy Banner',
      desc: 'Dark navy blue top header band with photo frame and crisp white body.',
      previewBg: 'bg-slate-900 text-white border border-slate-950'
    },
    {
      id: 'modern_minimal',
      title: 'Modern Minimalist',
      badge: 'Clean Whitespace',
      desc: 'Clean whitespace with generous margins and subtle grey accent dividers.',
      previewBg: 'bg-slate-50 border border-slate-200'
    }
  ];

  const handleApplyResume = (templateId) => {
    if (setResume) setResume(prev => ({ ...prev, template: templateId }));
    if (onNavigate) onNavigate('builder');
  };

  const handleOpenCoverLetterModal = (template) => {
    setSelectedLetterTemplate(template);
    setNewLetterName(`${template.title} Cover Letter`);
    setModalOpen(true);
  };

  const handleCreateCoverLetterFromTemplate = (e) => {
    e.preventDefault();
    if (!newLetterName.trim() || !selectedLetterTemplate) return;

    const newRecord = StorageService.createRecord('cover_letters', {
      name: newLetterName.trim(),
      template: selectedLetterTemplate.id,
      sender: {
        fullName: 'Ajitha D R',
        jobTitle: 'B.Tech – Information Technology',
        email: 'dajitha12@gmail.com',
        phone: '6374784776',
        location: 'Aruppukottai, Virudhunagar District, Tamil Nadu',
        avatarUrl: '',
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

    setModalOpen(false);
    if (onEditCoverLetter) onEditCoverLetter(newRecord.id);
    if (onNavigate) onNavigate('cover-letter-builder');
  };

  const activeResumeTemplate = resume?.template || 'classic_serif';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>FlowCV Template Gallery</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">FlowCV Templates Gallery</h1>
          <p className="text-xs text-slate-500">Choose matching Resume and Cover Letter templates with rich color themes.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveType('resumes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeType === 'resumes'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume Templates (10)</span>
          </button>
          <button
            onClick={() => setActiveType('cover_letters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeType === 'cover_letters'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Cover Letter Templates (10)</span>
          </button>
        </div>
      </div>

      {/* RESUME TEMPLATES GRID */}
      {activeType === 'resumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumeTemplates.map(tpl => {
            const isSelected = activeResumeTemplate === tpl.id;
            return (
              <div 
                key={tpl.id}
                className={`bg-white rounded-3xl border shadow-sm p-5 space-y-4 flex flex-col justify-between transition-all ${
                  isSelected ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                      {tpl.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{tpl.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{tpl.desc}</p>

                  <div className={`p-4 rounded-xl text-center space-y-1 ${tpl.previewBg}`}>
                    <div className="h-2.5 w-24 bg-slate-300 rounded mx-auto"></div>
                    <div className="h-2 w-16 bg-sky-400 rounded mx-auto"></div>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyResume(tpl.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                  }`}
                >
                  <span>{isSelected ? 'Open in Resume Editor' : 'Use Template'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* COVER LETTER TEMPLATES GRID */}
      {activeType === 'cover_letters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverLetterTemplates.map(tpl => (
            <div 
              key={tpl.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-sm p-5 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    {tpl.badge}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{tpl.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{tpl.desc}</p>

                <div className={`p-6 rounded-xl text-center space-y-1 ${tpl.previewBg}`}>
                  <div className="h-2.5 w-20 bg-slate-400/40 rounded mx-auto mb-2"></div>
                  <div className="h-1.5 w-32 bg-slate-400/30 rounded mx-auto"></div>
                  <div className="h-1.5 w-24 bg-slate-400/30 rounded mx-auto"></div>
                </div>
              </div>

              <button
                onClick={() => handleOpenCoverLetterModal(tpl)}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COVER LETTER FROM TEMPLATE MODAL */}
      {modalOpen && selectedLetterTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Create Cover Letter with {selectedLetterTemplate.title}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCoverLetterFromTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cover Letter Name / Target Position
                </label>
                <input
                  type="text"
                  value={newLetterName}
                  onChange={(e) => setNewLetterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow"
                >
                  Create & Open Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
