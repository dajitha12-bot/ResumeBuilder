import React, { useState } from 'react';
import { Palette, CheckCircle2, ArrowRight, Mail, FileText } from 'lucide-react';

export default function TemplatesPage({ resume, setResume, onNavigate }) {
  const [activeType, setActiveType] = useState('resumes'); // 'resumes' | 'cover_letters'

  const resumeTemplates = [
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
      id: 'classic_serif',
      title: 'Classic Academic Serif',
      badge: 'Formal Serif',
      desc: 'Traditional serif typography with centered header for formal corporate roles.',
      previewBg: 'font-serif bg-white border-b-2 border-slate-900'
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
    }
  ];

  const coverLetterTemplates = [
    {
      id: 'desert_rock',
      title: 'Desert Rock',
      badge: 'Two-Column Layout',
      desc: 'Warm beige left sidebar with circular avatar photo, name & contact info; white letter body right.',
      previewBg: 'bg-[#e8e0d5] border border-[#d4c8b8]'
    },
    {
      id: 'gold_minimal',
      title: 'Gold Minimal',
      badge: 'Border Frame',
      desc: 'Gold border frame with top inline header, photo frame, and gold accent dividers.',
      previewBg: 'bg-white border-2 border-[#d4af37]'
    },
    {
      id: 'hunter_green',
      title: 'Hunter Green',
      badge: 'Multi-Column',
      desc: 'Sage green left sidebar for contact details and photo; crisp white body area right.',
      previewBg: 'bg-[#2b4c3f] text-white border border-[#1e382e]'
    },
    {
      id: 'viola_purple',
      title: 'Viola Purple',
      badge: 'Top Banner Band',
      desc: 'Dark purple top header band with circular avatar photo & white text; white letter body below.',
      previewBg: 'bg-[#3b1e3e] text-white border border-purple-900'
    },
    {
      id: 'modern_blue',
      title: 'Modern Blue',
      badge: 'Clean Blue Accent',
      desc: 'Sky blue accent line header, structured recipient box, and formal typography.',
      previewBg: 'border-t-4 border-sky-600 bg-white'
    },
    {
      id: 'executive_classic',
      title: 'Executive Classic',
      badge: 'Formal Serif',
      desc: 'Formal serif typography with centered header for executive applications.',
      previewBg: 'font-serif bg-white border-b border-slate-400'
    }
  ];

  const handleApplyResume = (templateId) => {
    if (setResume) setResume(prev => ({ ...prev, template: templateId }));
    if (onNavigate) onNavigate('builder');
  };

  const handleApplyCoverLetter = (templateId) => {
    if (onNavigate) onNavigate('cover-letters');
  };

  const activeResumeTemplate = resume?.template || 'modern';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>FlowCV Template Gallery</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">FlowCV Templates</h1>
          <p className="text-xs text-slate-500">Choose from ATS-friendly Resume and Cover Letter designs.</p>
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
            <span>Resume Templates ({resumeTemplates.length})</span>
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
            <span>Cover Letter Templates ({coverLetterTemplates.length})</span>
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
                onClick={() => handleApplyCoverLetter(tpl.id)}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
              >
                <span>Create Cover Letter With This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
