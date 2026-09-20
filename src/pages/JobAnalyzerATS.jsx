import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Star, 
  FolderKanban, 
  ArrowRight, 
  BookOpen, 
  RefreshCw,
  Layers,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export default function JobAnalyzerATS({ resume, setResume, vaultItems = [], onNavigate }) {
  const defaultJd = `Role: Junior Java Developer
Company: TechSolutions Inc.

Required Skills:
- Java 17+
- Spring Boot
- REST APIs
- MySQL / SQL databases

Preferred Skills:
- Docker
- AWS (S3, EC2)
- Git & GitHub

Experience: 0-2 years
Education: Bachelor's in CS / IT / related field

Responsibilities:
- Build microservices using Java & Spring Boot
- Design relational database schemas
- Integrate frontend React components with backend REST APIs`;

  const [jobText, setJobText] = useState(defaultJd);
  const [analyzing, setAnalyzing] = useState(false);
  const [jdData, setJdData] = useState({
    title: 'Junior Java Developer',
    requiredSkills: ['Java', 'Spring Boot', 'REST API', 'MySQL'],
    preferredSkills: ['Docker', 'AWS', 'Git'],
    keywords: ['Backend', 'REST API', 'Database', 'Microservices'],
    experience: '0-2 years',
    education: "Bachelor's degree in CS / IT"
  });

  const [atsAnalysis, setAtsAnalysis] = useState({
    atsScore: 82,
    breakdown: {
      keywordMatch: { score: 30, max: 35 },
      skillsMatch: { score: 25, max: 30 },
      experienceMatch: { score: 15, max: 20 },
      educationMatch: { score: 10, max: 10 },
      formatting: { score: 2, max: 5 }
    },
    matchingSkills: ['Java', 'Spring Boot', 'SQL', 'REST API', 'Git'],
    missingSkills: ['Docker', 'AWS'],
    matchingKeywords: ['Backend', 'REST API', 'Database'],
    missingKeywords: ['Docker Containerization', 'AWS Cloud'],
    explanations: [
      '✓ Strong Java & Spring Boot match across projects and internship',
      '✓ Excellent match for relational database (MySQL/SQL) requirements',
      '✓ Education degree matches Bachelor\'s in Information Technology',
      '⚠ REST API implementation present but security/exception handling is limited',
      '✗ Docker containerization experience is missing from resume',
      '✗ AWS cloud services experience is missing from resume'
    ]
  });

  const [selectedProjects, setSelectedProjects] = useState([
    {
      id: 'cv_001',
      title: 'Smart University Event Management',
      stars: 5,
      rationale: 'Selected because the project contains JAVA, SPRING BOOT, SQL and REST API skills matching the job description.',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'REST API']
    },
    {
      id: 'cv_002',
      title: 'Smart Transit Pass Portal',
      stars: 4,
      rationale: 'Selected because the project contains REACT, SPRING BOOT and SQL skills matching the job description.',
      technologies: ['React', 'Spring Boot', 'PostgreSQL', 'QR SDK']
    },
    {
      id: 'cv_004',
      title: 'AI Zoo Planner',
      stars: 3,
      rationale: 'Contains Python algorithm and schedule optimization logic.',
      technologies: ['Python', 'Genetic Algorithm']
    }
  ]);

  const [skillGapRoadmap, setSkillGapRoadmap] = useState([
    { skill: 'Docker', status: 'Missing', priority: 'High', suggestedTopic: 'Docker containers, Dockerfiles, docker-compose for Spring Boot app.' },
    { skill: 'AWS Basics', status: 'Missing', priority: 'Medium', suggestedTopic: 'AWS EC2 deployment, S3 bucket storage, IAM basic concepts.' },
    { skill: 'REST API Exception Handling', status: 'Partial', priority: 'Medium', suggestedTopic: 'Global ControllerAdvice, HTTP status error payloads in Spring Boot.' }
  ]);

  const [tailoring, setTailoring] = useState(false);

  const handleRunAnalysis = async () => {
    if (!jobText.trim()) return;
    setAnalyzing(true);
    try {
      // 1. Analyze Job Requirements
      const jdRes = await api.analyzeJob(jobText);
      setJdData(jdRes);

      // 2. Calculate Explainable ATS Score
      const atsRes = await api.calculateATS({
        resumeData: resume,
        jobRequirements: jdRes
      });
      setAtsAnalysis(atsRes);

      // 3. AI Project Selection
      const projRes = await api.selectProjects('user_001', jdRes);
      if (projRes?.length) setSelectedProjects(projRes);

      // 4. Skill Gap Roadmap
      const resumeSkillsList = [];
      if (resume?.skills) {
        Object.values(resume.skills).forEach(val => {
          if (Array.isArray(val)) resumeSkillsList.push(...val);
        });
      }
      const gapRes = await api.analyzeSkillGap(resumeSkillsList, jdRes.requiredSkills.concat(jdRes.preferredSkills || []));
      if (gapRes?.roadmap) setSkillGapRoadmap(gapRes.roadmap);

    } catch (e) {
      console.error('Job analysis error:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    setTailoring(true);
    try {
      const tailored = await api.tailorResume('user_001', resume.id || 'resume_001', jdData);
      setResume(tailored);
      alert('Resume tailored successfully using ground truth from your Career Vault! View it in Resume Builder.');
      onNavigate('builder');
    } catch (e) {
      console.error(e);
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>AI Job Match & ATS Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Job Description Analysis & Explainable ATS</h1>
          <p className="text-xs text-slate-500">Paste any target job description to match skills, rank projects, and calculate deterministic ATS scores.</p>
        </div>

        <button
          onClick={handleTailorResume}
          disabled={tailoring}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-all flex-shrink-0"
        >
          {tailoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate Job-Specific Resume</span>
        </button>
      </div>

      {/* Input & Extracted Requirements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Job Description (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Paste Job Description</h3>
            <span className="text-[11px] text-slate-400 font-medium">Text Input</span>
          </div>

          <textarea
            rows={10}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-mono"
            placeholder="Paste raw JD text here..."
          />

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Run AI Job Analysis & ATS Match</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Extracted Job Requirements Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Extracted Job Requirements</h3>
            <p className="text-xs text-slate-500">Target Role: <strong className="text-slate-900">{jdData.title}</strong></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 space-y-1">
              <span className="font-bold text-brand-900 text-[11px] uppercase tracking-wider block">Required Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {jdData.requiredSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white text-brand-700 rounded font-semibold text-[11px] border border-brand-200">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-lavender-50/60 rounded-xl border border-lavender-100 space-y-1">
              <span className="font-bold text-lavender-900 text-[11px] uppercase tracking-wider block">Preferred Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {jdData.preferredSkills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white text-lavender-700 rounded font-semibold text-[11px] border border-lavender-200">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">Experience Requirement</span>
              <p className="text-slate-900 font-semibold">{jdData.experience}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">Education Requirement</span>
              <p className="text-slate-900 font-semibold">{jdData.education}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Resume vs Job Matching Matrix & Explainable ATS Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Resume vs Job Skill Match Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Resume vs Job Skill Match</h3>
            <p className="text-xs text-slate-500">Side-by-side skill evidence comparison</p>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Java', status: 'Strong', icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { name: 'Spring Boot', status: 'Strong', icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { name: 'MySQL / SQL', status: 'Strong', icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { name: 'REST API', status: 'Partial', icon: AlertTriangle, style: 'bg-amber-50 text-amber-700 border-amber-200' },
              { name: 'Docker', status: 'Missing', icon: XCircle, style: 'bg-rose-50 text-rose-700 border-rose-200' },
              { name: 'AWS', status: 'Missing', icon: XCircle, style: 'bg-rose-50 text-rose-700 border-rose-200' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs border border-slate-200/70">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${item.style}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainable ATS Score Card (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Explainable ATS Score</h3>
              <p className="text-xs text-slate-500">Transparent deterministic scoring breakdown</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-brand-600">{atsAnalysis.atsScore}</span>
              <span className="text-xs text-slate-400 font-bold block">/ 100</span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Keyword Match</span>
                <span>30 / 35</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Skills Match</span>
                <span>25 / 30</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '83%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Experience Relevance</span>
                <span>15 / 20</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-lavender-500" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Detailed Explanations */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <h5 className="text-xs font-bold text-slate-700">Why this score?</h5>
            <div className="space-y-1 text-[11px]">
              {atsAnalysis.explanations.map((exp, i) => (
                <div key={i} className={`p-1.5 rounded font-medium ${
                  exp.startsWith('✓') ? 'text-emerald-700 bg-emerald-50/50' : exp.startsWith('⚠') ? 'text-amber-700 bg-amber-50/50' : 'text-rose-700 bg-rose-50/50'
                }`}>
                  {exp}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* AI Project Selector Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">AI Project Selector from Career Vault</h3>
            <p className="text-xs text-slate-500">Automatically selects the most relevant projects for the target job position</p>
          </div>
          <span className="px-2.5 py-1 bg-lavender-50 text-lavender-700 border border-lavender-200 rounded-full text-xs font-bold">
            Evidence Rank
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedProjects.map((p, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-xs">{p.title}</h4>
                  <div className="flex text-amber-400">
                    {Array.from({ length: p.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] mt-2 italic leading-relaxed">{p.rationale}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                <span className="font-semibold text-slate-500">{p.technologies?.join(' • ')}</span>
                <span className="text-emerald-600 font-bold">Selected</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gap & Learning Roadmap */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Skill Gap & Learning Roadmap</h3>
          <p className="text-xs text-slate-500">Suggested priority path to qualify 100% for this job description</p>
        </div>

        <div className="space-y-2">
          {skillGapRoadmap.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{idx + 1}. {item.skill}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{item.suggestedTopic}</p>
              </div>
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-medium whitespace-nowrap">
                Status: {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
