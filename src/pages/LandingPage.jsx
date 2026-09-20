import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  FolderKanban, 
  Bot, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const featureCards = [
    {
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      title: 'AI Resume Builder',
      desc: 'Build ATS-compliant resumes with AI summary generation, smart bullet points, and live template switching.'
    },
    {
      icon: Target,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: 'AI Job Analyzer & ATS',
      desc: 'Extract key job skills, analyze keyword matches, and calculate explainable ATS scores with line-item breakdowns.'
    },
    {
      icon: FolderKanban,
      color: 'bg-lavender-50 text-lavender-600 border-lavender-100',
      title: 'Career Vault & Skill Proof',
      desc: 'Centralize all your projects, internships, and certifications. Connect skills to actual evidence graphs.'
    },
    {
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: 'Resume Truth Guard',
      desc: 'Audits AI outputs against your Career Vault to flag unverified claims, metrics, or non-existent projects.'
    },
    {
      icon: Bot,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      title: 'AI Career Assistant',
      desc: 'Generate targeted interview questions directly from your resume bullet points and create personalized cover letters.'
    }
  ];

  const workflowSteps = [
    { title: 'Your Career Data', sub: 'Projects, Skills, Education' },
    { title: 'AI Resume Builder', sub: 'Draft & Enhance Resume' },
    { title: 'Job Description', sub: 'Paste Target Position' },
    { title: 'AI Job & ATS Analysis', sub: 'Keyword Match & Score' },
    { title: 'Tailored Resume', sub: 'Ground-Truth Customization' },
    { title: 'Interview Preparation', sub: 'Resume-to-Interview Questions' }
  ];

  return (
    <div className="min-h-screen bg-slatebg space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-brand-50/60 via-slatebg to-slatebg border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-brand-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Resume Creation & Career Preparation for Freshers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Build a <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-lavender-600 bg-clip-text text-transparent">Job-Ready Resume</span> with AI
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Create, optimize, verify, and customize your resume using AI based on your real skills, projects, education, and target job description—with zero invented facts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('builder')}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('builder')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-200 shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Create Resume</span>
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Explainable ATS Scoring</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ground-Truth Truth Guard</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Skill Evidence Graph</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF & DOCX Export</span>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Comprehensive Career Building Suite</h2>
          <p className="text-sm text-slate-500">Everything you need to showcase your skills and pass ATS filters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Workflow Step Diagram */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">End-to-End Execution</span>
            <h2 className="text-2xl font-bold text-slate-900">Application Workflow</h2>
            <p className="text-xs text-slate-500">From career data input to final interview preparation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center space-y-1 relative group hover:border-brand-300 transition-all">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs inline-flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-xs leading-tight">{step.title}</h4>
                <p className="text-[10px] text-slate-500">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Credentials Footer Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-brand-50 to-lavender-50 p-6 rounded-2xl border border-brand-100 space-y-2">
          <span className="px-2.5 py-1 bg-brand-600 text-white font-semibold text-[11px] rounded-full">
            Preloaded Demo Account Ready
          </span>
          <h3 className="font-bold text-slate-900 text-base">Ajitha D R — National Engineering College</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Pre-configured with III Year B.Tech IT projects (Smart University Event Management, Smart Transit Pass Portal, Ocean Intelligence), internships, and certifications for instant presentation testing.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="mt-2 inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Launch Demo Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
