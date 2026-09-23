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
    { label: 'Saved Resumes', value: '3 Managed', color: 'text-sky-600 bg-sky-50 border-sky-100', icon: FileText },
    { label: 'Saved Cover Letters', value: '2 Active', color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Mail },
    { label: 'ATS Target Rating', value: '92 / 100', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
    { label: 'FlowCV Layouts', value: '20 Templates', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: Palette },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800 text-left">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FlowCV Resume & Cover Letter Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {userName}! 👋</h1>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            {user?.degree || 'B.Tech Information Technology'} — {user?.college || 'National Engineering College'}. Manage your resumes, build matching cover letters, and export PDF applications.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('my-resumes')}
            className="px-4 py-2.5 bg-white text-sky-700 hover:bg-sky-50 font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </button>
          <button
            onClick={() => onNavigate('cover-letters')}
            className="px-4 py-2.5 bg-sky-700 text-white hover:bg-sky-800 font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Cover Letter</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{st.label}</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{st.value}</h3>
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
        <h2 className="text-base font-bold text-slate-900">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('my-resumes')}
            className="p-4 bg-white hover:bg-sky-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">My Resumes</h4>
            <p className="text-[11px] text-slate-500">Create & edit resume cards</p>
          </button>

          <button
            onClick={() => onNavigate('cover-letters')}
            className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
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
            <h4 className="font-bold text-slate-900 text-xs">Templates Gallery</h4>
            <p className="text-[11px] text-slate-500">Explore 20 ATS designs</p>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">AI Assistant</h4>
            <p className="text-[11px] text-slate-500">AI bullets & career chat</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Active Resume & Active Cover Letter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Resume Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                📄 Active Resume
              </h3>
              <p className="text-xs text-slate-500">Current working draft</p>
            </div>
            <button 
              onClick={() => onNavigate('templates')}
              className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-semibold"
            >
              {resume?.template || 'Classic Serif'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{resume?.title || 'Ajitha D R Resume'}</h4>
                <p className="text-xs text-sky-600 font-medium">{resume?.targetRole || 'B.Tech – Information Technology'}</p>
              </div>
              <button
                onClick={() => onNavigate('builder')}
                className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Resume
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">EDUCATION</span>
                <span className="font-bold text-slate-800">3 Entries</span>
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
        </div>

        {/* Active Cover Letter Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                ✉️ Active Cover Letter
              </h3>
              <p className="text-xs text-slate-500">FlowCV letter template</p>
            </div>
            <button 
              onClick={() => onNavigate('cover-letters')}
              className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold"
            >
              Desert Rock Layout
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Software Engineer Cover Letter</h4>
                <p className="text-xs text-purple-600 font-medium">Target: Meta Platforms Inc.</p>
              </div>
              <button
                onClick={() => onNavigate('cover-letters')}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Cover Letter
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">RECIPIENT</span>
                <span className="font-bold text-slate-800">Ms. Wings (Meta)</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">AI DRAFT STATUS</span>
                <span className="font-bold text-emerald-600">Tailored</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
