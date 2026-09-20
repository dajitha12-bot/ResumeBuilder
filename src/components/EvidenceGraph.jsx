import React from 'react';
import { FolderKanban, Briefcase, Award, CheckCircle2 } from 'lucide-react';

export default function EvidenceGraph({ evidenceGraph }) {
  if (!evidenceGraph) return null;

  const { skill, projects = [], internships = [], certifications = [] } = evidenceGraph;
  const totalProofCount = projects.length + internships.length + certifications.length;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
            {skill.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">{skill} Evidence Tree</h4>
            <p className="text-xs text-slate-500">Proven across {totalProofCount} Career Vault record(s)</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Skill
        </span>
      </div>

      {/* Visual Tree Mapping */}
      <div className="space-y-3 relative pl-4 border-l-2 border-brand-200">
        
        {/* Projects Branch */}
        {projects.length > 0 && (
          <div className="relative space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <FolderKanban className="w-4 h-4 text-brand-600" />
              <span>Demonstrated in Projects ({projects.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
              {projects.map((p, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-900 block">{p.title}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{p.proof}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internship Branch */}
        {internships.length > 0 && (
          <div className="relative space-y-2 pt-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Briefcase className="w-4 h-4 text-lavender-600" />
              <span>Applied in Internship ({internships.length})</span>
            </div>
            <div className="pl-4">
              {internships.map((i, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-900 block">{i.title}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{i.proof}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Branch */}
        {certifications.length > 0 && (
          <div className="relative space-y-2 pt-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Certified via Courses ({certifications.length})</span>
            </div>
            <div className="pl-4">
              {certifications.map((c, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900 block">{c.title}</span>
                    <p className="text-slate-600 text-[11px]">{c.proof}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalProofCount === 0 && (
          <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-500">
            No evidence recorded in Career Vault yet for "{skill}". Add a project or certification to verify.
          </div>
        )}

      </div>
    </div>
  );
}
