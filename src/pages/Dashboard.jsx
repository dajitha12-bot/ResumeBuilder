import React from 'react';
import { 
  FileText, 
  Mail,
  Palette, 
  Bot, 
  Plus, 
  ArrowRight, 
  Eye, 
  Edit3, 
  Sparkles,
  TrendingUp,
  Layout,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ user, resume, versions = [], onNavigate }) {
  const userName = user?.name || 'Ajitha D R';

  const stats = [
    { label: 'Resume Completion', value: '85%', color: 'text-brand-600 bg-brand-50 border-brand-100', icon: FileText },
    { label: 'ATS Target Rating', value: '92 / 100', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
    { label: 'Saved Versions', value: `${versions.length || 3}`, color: 'text-lavender-600 bg-lavender-50 border-lavender-100', icon: TrendingUp },
    { label: 'FlowCV Layouts', value: '8 Available', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: Palette },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-lavender-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FlowCV-Style Resume Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {userName}! 👋</h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
            {user?.degree || 'B.Tech Information Technology'} — {user?.college || 'National Engineering College'}. Manage your FlowCV resume versions, customize templates, and build job-ready applications.
          </p>
        </div>

        <button
          onClick={() => onNavigate('my-resumes')}
          className="px-5 py-2.5 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{st.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{st.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${st.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('my-resumes')}
            className="p-4 bg-white hover:bg-brand-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">My Resumes</h4>
            <p className="text-[11px] text-slate-500">FlowCV editor & version manager</p>
          </button>

          <button
            onClick={() => onNavigate('cover-letters')}
            className="p-4 bg-white hover:bg-sky-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Cover Letters</h4>
            <p className="text-[11px] text-slate-500">FlowCV cover letter editor</p>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="p-4 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Palette className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Templates</h4>
            <p className="text-[11px] text-slate-500">8 FlowCV modern layouts</p>
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className="p-4 bg-white hover:bg-lavender-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-lavender-100 text-lavender-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Resume Builder</h4>
            <p className="text-[11px] text-slate-500">FlowCV editor & customizer</p>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">AI Assistant</h4>
            <p className="text-[11px] text-slate-500">Interview Q&A & Cover Letter</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Active Resume & FlowCV Templates Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Resume Card (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Active Resume</h3>
              <p className="text-xs text-slate-500">Current working draft</p>
            </div>
            <button 
              onClick={() => onNavigate('templates')}
              className="px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-semibold"
            >
              Template: {resume?.template || 'Classic Serif'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{resume?.title || 'Ajitha D R Resume'}</h4>
                <p className="text-xs text-brand-600 font-medium">{resume?.targetRole || 'B.Tech – Information Technology'}</p>
                <p className="text-[11px] text-slate-400 mt-1">Last Updated: {resume?.updatedAt || '2026-09-23'}</p>
              </div>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => onNavigate('builder')}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Open FlowCV Editor
                </button>
                <button
                  onClick={() => onNavigate('builder')}
                  className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">EDUCATION</span>
                <span className="font-bold text-slate-800">3 Timeline Entries</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">SKILLS</span>
                <span className="font-bold text-slate-800">7 Languages</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">PROJECTS</span>
                <span className="font-bold text-emerald-600">2 Included</span>
              </div>
            </div>
          </div>

          {/* Versions list */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700">Saved Resume Versions ({versions.length || 3}):</h5>
            <div className="space-y-1.5">
              {(versions.length > 0 ? versions : [
                { name: 'Ajitha D R Resume', targetRole: 'B.Tech – Information Technology', template: 'Classic Serif' },
                { name: 'Full Stack Developer Resume', targetRole: 'React + Java Developer', template: 'Software Developer' },
                { name: 'Fresher Software Engineer', targetRole: 'Associate Software Engineer', template: 'Fresher' }
              ]).map((ver, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs cursor-pointer border border-slate-200/60" 
                  onClick={() => onNavigate('my-resumes')}
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-brand-500" />
                    <div>
                      <span className="font-semibold text-slate-900">{ver.name}</span>
                      <span className="text-slate-500 text-[11px] block">{ver.targetRole}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border text-slate-600 font-mono">{ver.template || 'Classic Serif'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FlowCV Layout Showcase Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">FlowCV Layouts</h3>
              <p className="text-xs text-slate-500">8 Modern ATS Templates</p>
            </div>
            <Layout className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 space-y-1">
              <span className="font-bold text-brand-900">FlowCV Classic Serif</span>
              <p className="text-brand-700 text-[11px]">Serif typography, blue underline headings, right photo avatar & education timeline.</p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
              <span className="font-bold text-indigo-900">FlowCV Modern Two-Column</span>
              <p className="text-indigo-700 text-[11px]">Sidebar for photo, contact info & skills; main column for career objective & projects.</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-900">FlowCV Minimalist</span>
              <p className="text-emerald-700 text-[11px]">Generous whitespace, navy text, zero decorative lines for clean readability.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('templates')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Explore All 8 Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
