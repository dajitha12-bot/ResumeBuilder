import React from 'react';
import { Palette, CheckCircle2, ArrowRight, Sparkles, Layout } from 'lucide-react';

export default function TemplatesPage({ resume, setResume, onNavigate }) {
  const templates = [
    {
      id: 'modern',
      title: 'Modern Professional',
      badge: 'Popular',
      desc: 'Clean pastel design with soft header gradients, ideal for technology and product roles.',
      previewBg: 'bg-gradient-to-r from-brand-50 via-slate-50 to-lavender-50'
    },
    {
      id: 'professional',
      title: 'Professional ATS Standard',
      badge: '100% ATS Approved',
      desc: 'Classic black & white structured format with clear horizontal rules for maximum ATS scanner accuracy.',
      previewBg: 'bg-white border-b-2 border-slate-800'
    },
    {
      id: 'minimal',
      title: 'Minimalist Clean',
      badge: 'Elegant',
      desc: 'Focuses on typography, generous whitespace, and concise bullet point readability.',
      previewBg: 'bg-slate-50 border-b border-slate-200'
    },
    {
      id: 'fresher',
      title: 'Fresher Student',
      badge: 'Recommended for College Demo',
      desc: 'Highlights education, CGPA, technical skills, and academic projects right at the top.',
      previewBg: 'bg-brand-50 border border-brand-100'
    },
    {
      id: 'software_developer',
      title: 'Software Developer',
      badge: 'Tech Lead Choice',
      desc: 'Emphasizes technical stack, GitHub repositories, programming languages, and microservices.',
      previewBg: 'border-l-4 border-brand-600 bg-white'
    },
    {
      id: 'academic',
      title: 'Academic & Research',
      badge: 'Formal',
      desc: 'Serif font formatting suitable for lab assistantships, academic papers, and certifications.',
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
            <span>ATS-Friendly Layout Gallery</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Templates</h1>
          <p className="text-xs text-slate-500">Choose from 6 professionally crafted, ATS-tested layout templates.</p>
        </div>

        <span className="px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold">
          Current: {templates.find(t=>t.id===activeTemplate)?.title || 'Modern'}
        </span>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(tpl => {
          const isSelected = activeTemplate === tpl.id;
          return (
            <div 
              key={tpl.id}
              className={`bg-white rounded-3xl border shadow-sm p-6 space-y-4 flex flex-col justify-between transition-all ${
                isSelected ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lavender-50 text-lavender-700 border border-lavender-200">
                    {tpl.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{tpl.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tpl.desc}</p>

                {/* Thumbnail Header Mock */}
                <div className={`p-4 rounded-xl text-center space-y-1 ${tpl.previewBg}`}>
                  <div className="h-3 w-32 bg-slate-300 rounded mx-auto"></div>
                  <div className="h-2 w-20 bg-brand-300 rounded mx-auto"></div>
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
                <span>{isSelected ? 'Customize in Builder' : 'Apply Template'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
