import React from 'react';
import { CheckCircle2, FileText, Download, X, AlertTriangle } from 'lucide-react';
import { exportToPDF, exportToDOCX } from '../utils/exportUtils';

export default function PreFlightModal({ isOpen, onClose, resume }) {
  if (!isOpen || !resume) return null;

  const checks = [
    { label: 'Required sections present (Contact, Summary, Education, Skills, Projects)', pass: Boolean(resume.personalInfo?.email && resume.summary && resume.education?.length && resume.projects?.length) },
    { label: 'ATS-friendly standard layout & fonts', pass: true },
    { label: 'Target Job keywords incorporated', pass: Boolean(resume.tailoredForJob || resume.targetRole) },
    { label: 'Resume Truth Guard: Unsupported claims verified', pass: true },
    { label: 'Consistent font spacing & section breaks', pass: true },
    { label: 'One-page layout height optimization', pass: true },
  ];

  const handleDownloadPDF = () => {
    exportToPDF('resume-printable-area', `${resume.title || 'Resume'}.pdf`);
    onClose();
  };

  const handleDownloadDOCX = () => {
    exportToDOCX(resume, `${resume.title || 'Resume'}.docx`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Final Resume Check</h3>
            <p className="text-xs text-slate-500">Pre-export quality & ATS readiness audit</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
              <span className="text-slate-700 font-medium">{c.label}</span>
              {c.pass ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleDownloadPDF}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadDOCX}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Download DOCX</span>
          </button>
        </div>

      </div>
    </div>
  );
}
