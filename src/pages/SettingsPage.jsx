import React, { useState } from 'react';
import { Settings, Key, ShieldCheck, RefreshCw, Check, RotateCcw, Download } from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function SettingsPage({ user, onResetData }) {
  const [apiKey, setApiKey] = useState(import.meta.env?.VITE_OPENAI_API_KEY || '');
  const [saved, setSaved] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const handleSaveApiKey = () => {
    localStorage.setItem('VITE_OPENAI_API_KEY', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      users: StorageService.getCollection('users'),
      resumes: StorageService.getCollection('resumes'),
      career_vault: StorageService.getCollection('career_vault'),
      jobs: StorageService.getCollection('job_descriptions'),
      ats_analysis: StorageService.getCollection('ats_analysis')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resume_builder_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>System Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings</h1>
        <p className="text-xs text-slate-500">Configure AI API credentials, demo state, theme preferences, and data backups.</p>
      </div>

      {/* OpenAI API Key Setting */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Key className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">OpenAI API Key Configuration</h3>
            <p className="text-xs text-slate-500">Connect your OpenAI key for live GPT completions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500">
              Key is stored securely in your browser's local environment.
            </span>
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
              <span>{saved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Mode Toggle & Data Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">Demo Data & Backup Management</h3>
            <p className="text-xs text-slate-500">Export persistent JSON data or reset to original Ajitha D R seed profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportData}
            className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left space-y-2 transition-all"
          >
            <Download className="w-5 h-5 text-brand-600" />
            <h4 className="font-bold text-slate-900 text-xs">Export All JSON Data</h4>
            <p className="text-[11px] text-slate-500">Download complete backup JSON file of your Career Vault and resumes.</p>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all data to preloaded Ajitha D R demo state?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="p-4 bg-rose-50/50 hover:bg-rose-100/50 rounded-2xl border border-rose-100 text-left space-y-2 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <h4 className="font-bold text-rose-900 text-xs">Reset to Original Demo State</h4>
            <p className="text-[11px] text-rose-700">Restores initial National Engg College profile and seed projects.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
