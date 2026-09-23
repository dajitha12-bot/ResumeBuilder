import React from 'react';
import { Palette, CheckCircle2, ArrowRight, Sparkles, Layout } from 'lucide-react';

export default function TemplatesPage({ resume, setResume, onNavigate }) {
  const templates = [
    {
      id: 'modern',
      title: 'Modern Professional',
      badge: 'Popular Choice',
      desc: 'Clean pastel layout with subtle header accent gradient, designed for technical & engineering roles.',
      previewBg: 'bg-gradient-to-r from-brand-50 via-slate-50 to-lavender-50 border border-brand-100'
    },
    {
      id: 'professional',
      title: 'Professional ATS Standard',
      badge: '100% ATS Approved',
      desc: 'Classic black & white structured format with horizontal rule lines for high ATS parser accuracy.',
      previewBg: 'bg-white border-b-2 border-slate-900'
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
      id: 'creative',
      title: 'Creative Designer',
      badge: 'Modern Accent',
      desc: 'Pastel lavender pill highlights for skills, certifications, and technical domains.',
      previewBg: 'bg-lavender-50 border border-lavender-100'
    },
    {
      id: 'fresher',
      title: 'Fresher Student',
      badge: 'College Project Demo',
      desc: 'Highlights education, CGPA, technical skills, and academic mini-projects first.',
      previewBg: 'bg-brand-50 border border-brand-100'
    },
    {
      id: 'software_developer',
      title: 'Software Developer',
      badge: 'Tech Stack Choice',
      desc: 'Code-centric format highlighting programming languages, microservices, and GitHub links.',
      previewBg: 'border-l-4 border-brand-600 bg-white'
    },
    {
      id: 'academic',
      title: 'Academic & Research',
      badge: 'Formal Serif',
      desc: 'Formal serif typography suitable for lab assistantships, publications, and certifications.',
      previewBg: 'font-serif bg-white border-b border-slate-800'
    }
  ];

  const handleApply = (templateId) => {
    setResume(prev => ({ ...prev, template: templateId }));
    onNavigate('builder');
  };

  const activeTemplate = resume?.template || 'modern';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-lavender-50 text-lavender-700 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>FlowCV-Usability Template Gallery</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ATS Resume Templates</h1>
          <p className="text-xs text-slate-500">Choose from 8 professionally crafted, ATS-friendly templates.</p>
        </div>

        <span className="px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold">
          Active: {templates.find(t => t.id === activeTemplate)?.title || 'Modern'}
        </span>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(tpl => {
          const isSelected = activeTemplate === tpl.id;
          return (
            <div 
              key={tpl.id}
              className={`bg-white rounded-3xl border shadow-sm p-5 space-y-4 flex flex-col justify-between transition-all ${
                isSelected ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-lavender-50 text-lavender-700 border border-lavender-200">
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
                  <div className="h-2 w-16 bg-brand-300 rounded mx-auto"></div>
                </div>
              </div>

              <button
                onClick={() => handleApply(tpl.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                }`}
              >
                <span>{isSelected ? 'Open in FlowCV Editor' : 'Use Template'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
