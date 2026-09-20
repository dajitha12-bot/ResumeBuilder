import React from 'react';
import { 
  FileText, 
  Target, 
  FolderKanban, 
  Bot, 
  Plus, 
  ArrowRight, 
  Download, 
  Eye, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function Dashboard({ user, resume, vaultItems = [], versions = [], truthReport, onNavigate }) {
  const userName = user?.name || 'Ajitha D R';

  const stats = [
    { label: 'Resume Completion', value: '85%', color: 'text-brand-600 bg-brand-50 border-brand-100', icon: FileText },
    { label: 'ATS Score', value: '82 / 100', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Target },
    { label: 'Career Vault Items', value: `${vaultItems.length || 12}`, color: 'text-lavender-600 bg-lavender-50 border-lavender-100', icon: FolderKanban },
    { label: 'Resume Versions', value: `${versions.length || 3}`, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-lavender-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 backdrop-blur-sm text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Job-Ready Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {userName}! 👋</h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
            {user?.degree || 'B.Tech Information Technology'} — {user?.college || 'National Engineering College'}. Manage your resume versions, verify career claims, and prepare for interviews.
          </p>
        </div>

        <button
          onClick={() => onNavigate('builder')}
          className="px-5 py-2.5 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume Version</span>
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
            onClick={() => onNavigate('builder')}
            className="p-4 bg-white hover:bg-brand-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Create Resume</h4>
            <p className="text-[11px] text-slate-500">Edit form & preview live layout</p>
          </button>

          <button
            onClick={() => onNavigate('job-analyzer')}
            className="p-4 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Analyze Job & ATS</h4>
            <p className="text-[11px] text-slate-500">Match JD & project selector</p>
          </button>

          <button
            onClick={() => onNavigate('career-vault')}
            className="p-4 bg-white hover:bg-lavender-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-lavender-100 text-lavender-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Career Vault</h4>
            <p className="text-[11px] text-slate-500">Skills & evidence proof tree</p>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200 text-left space-y-2 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Career Assistant</h4>
            <p className="text-[11px] text-slate-500">Resume-to-interview Q&A</p>
          </button>
        </div>
      </div>

      {/* Content Grid: Recent Resume & Resume Health Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Resume */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Active Resume</h3>
              <p className="text-xs text-slate-500">Current working draft and template settings</p>
            </div>
            <span className="px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-semibold">
              Template: {resume?.template || 'Modern'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{resume?.title || 'Java Developer Resume'}</h4>
                <p className="text-xs text-brand-600 font-medium">{resume?.targetRole || 'Java Spring Boot Developer'}</p>
                <p className="text-[11px] text-slate-400 mt-1">Last Updated: {resume?.updatedAt || '2026-09-20'}</p>
              </div>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => onNavigate('builder')}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onNavigate('builder')}
                  className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">PROJECTS</span>
                <span className="font-bold text-slate-800">{resume?.projects?.length || 2} Included</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">SKILLS</span>
                <span className="font-bold text-slate-800">10 Verified</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold">ATS RATING</span>
                <span className="font-bold text-emerald-600">82% Match</span>
              </div>
            </div>
          </div>

          {/* Versions list */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700">Saved Resume Versions ({versions.length || 3}):</h5>
            <div className="space-y-1.5">
              {[
                { name: 'Java Developer Resume', role: 'Java Spring Boot Developer', template: 'Modern' },
                { name: 'Full Stack Developer Resume', role: 'React + Java Developer', template: 'Software Developer' },
                { name: 'Fresher Software Engineer', role: 'Associate Software Engineer', template: 'Fresher' }
              ].map((ver, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs cursor-pointer border border-slate-200/60" onClick={() => onNavigate('builder')}>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-brand-500" />
                    <div>
                      <span className="font-semibold text-slate-900">{ver.name}</span>
                      <span className="text-slate-500 text-[11px] block">{ver.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border text-slate-600 font-mono">{ver.template}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Health Audit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Resume Health Audit</h3>
            <p className="text-xs text-slate-500">Automated structural & truth verification</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-900">Required Sections Present</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">Contact info, summary, education, skills, and projects are filled.</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-blue-900">ATS Formatting Compliant</span>
                <p className="text-blue-700 text-[11px] mt-0.5">No graphic tables or unreadable symbols detected.</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-900">Truth Guard Notice</span>
                <p className="text-amber-800 text-[11px] mt-0.5">Ensure all listed metrics have matching evidence in Career Vault.</p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-start space-x-2.5">
              <Target className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-indigo-900">Missing Job Keywords</span>
                <p className="text-indigo-800 text-[11px] mt-0.5">Docker & AWS are missing for target Java Backend roles.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('job-analyzer')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Run Full Job Match & ATS Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
