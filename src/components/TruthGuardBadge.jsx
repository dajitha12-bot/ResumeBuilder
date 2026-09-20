import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Info } from 'lucide-react';

export default function TruthGuardBadge({ report, onRemoveClaim }) {
  const [expanded, setExpanded] = useState(false);

  if (!report) return null;

  const { verified, truthScore = 100, findings = [] } = report;

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      verified
        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
        : 'bg-amber-50/60 border-amber-200 text-amber-900'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
            verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {verified ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-sm leading-tight">Resume Truth Guard</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}>
                Score: {truthScore}% Verified
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {verified
                ? 'All resume claims, projects, and skills are backed by evidence in your Career Vault.'
                : `${findings.length} claim(s) require verification against your Career Vault.`}
            </p>
          </div>
        </div>

        {findings.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            <span>{expanded ? 'Hide Details' : 'View Claims'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded findings details */}
      {expanded && findings.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2.5">
          <p className="text-xs font-bold text-slate-700">Verification Report Details:</p>
          {findings.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  item.status === 'unsupported' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div className="text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{item.field}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 uppercase font-mono">
                      {item.claim}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{item.message}</p>
                  <p className="text-[11px] text-amber-700 italic mt-1">
                    Not available in your Career Vault.
                  </p>
                </div>
              </div>
              {onRemoveClaim && (
                <button
                  onClick={() => onRemoveClaim(item)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium whitespace-nowrap pl-2"
                >
                  Remove Claim
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
