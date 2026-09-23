import React, { useState } from 'react';
import { Sparkles, FileText, Check, Copy, RefreshCw, Target, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AIToolsTab({ resume, setResume, onOpenBulletModal }) {
  const [targetJobText, setTargetJobText] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingCover, setGeneratingCover] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);

  const handleGenerateAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await api.generateAISummary({
        education: resume.education,
        skills: resume.skills?.languages,
        projects: resume.projects,
        targetRole: resume.targetRole
      });
      setResume(prev => ({ ...prev, summary: res.summary }));
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleImproveWriting = async (mode) => {
    if (!resume.summary) return;
    setGeneratingSummary(true);
    try {
      const res = await api.generateAIBullet(resume.summary, mode);
      setResume(prev => ({ ...prev, summary: res.bullet }));
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleTailorResume = async () => {
    if (!targetJobText.trim()) return;
    setTailoring(true);
    try {
      const jd = await api.analyzeJob(targetJobText);
      const tailored = await api.tailorResume('user_001', resume.id || 'resume_001', jd);
      setResume(tailored);
      alert('Resume tailored using ground truth from Career Vault!');
    } catch (e) {
      console.error(e);
    } finally {
      setTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setGeneratingCover(true);
    try {
      const res = await api.generateCoverLetter(resume, { rawText: targetJobText });
      setCoverLetter(res.coverLetter);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleCopyCover = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      
      {/* Truth Guard Policy Banner */}
      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-900 block">Ground Truth Verified AI</span>
          <p className="text-[10px] text-emerald-700">AI tools enhance writing without inventing fake companies, metrics, or non-existent projects.</p>
        </div>
      </div>

      {/* AI Summary & Writing Improver */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Professional Summary AI
          </h4>
          <button
            onClick={handleGenerateAISummary}
            disabled={generatingSummary}
            className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-xs shadow-sm"
          >
            {generatingSummary ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Generate AI Summary'}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => handleImproveWriting('professional')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[11px]"
          >
            Improve Writing
          </button>
          <button
            onClick={() => handleImproveWriting('short')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[11px]"
          >
            Make Concise
          </button>
          <button
            onClick={() => handleImproveWriting('achievement')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[11px]"
          >
            Make Professional
          </button>
        </div>
      </div>

      {/* AI Bullet Point Generator Trigger */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lavender-600" /> AI Bullet Point Generator
          </h4>
          <button
            onClick={onOpenBulletModal}
            className="px-3 py-1.5 bg-lavender-100 hover:bg-lavender-200 text-lavender-700 font-bold rounded-xl text-xs"
          >
            Open Bullet Generator
          </button>
        </div>
        <p className="text-[11px] text-slate-500">Transform draft project lines into high-impact action verb bullet points.</p>
      </div>

      {/* Job-Specific Resume Tailor & Cover Letter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-indigo-600" /> Job Description Tailor & Cover Letter
        </h4>

        <textarea
          rows={3}
          value={targetJobText}
          onChange={(e) => setTargetJobText(e.target.value)}
          placeholder="Paste Job Description text here..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
        />

        <div className="flex gap-2">
          <button
            onClick={handleTailorResume}
            disabled={tailoring || !targetJobText.trim()}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1"
          >
            {tailoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Tailor Resume</span>
          </button>

          <button
            onClick={handleGenerateCoverLetter}
            disabled={generatingCover || !targetJobText.trim()}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1"
          >
            {generatingCover ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>AI Cover Letter</span>
          </button>
        </div>

        {coverLetter && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[10px] text-slate-500 uppercase">Generated Cover Letter</span>
              <button onClick={handleCopyCover} className="text-brand-600 text-xs flex items-center gap-1">
                {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCover ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap">{coverLetter}</p>
          </div>
        )}
      </div>

    </div>
  );
}
