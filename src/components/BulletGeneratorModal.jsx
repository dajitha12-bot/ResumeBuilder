import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';

export default function BulletGeneratorModal({ isOpen, onClose, onInsert }) {
  const [inputText, setInputText] = useState('Created a bus tracking website.');
  const [mode, setMode] = useState('professional');
  const [generatedBullet, setGeneratedBullet] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (selectedMode = mode) => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.generateAIBullet(inputText, selectedMode);
      setGeneratedBullet(res.bullet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (generatedBullet && onInsert) {
      onInsert(generatedBullet);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Bullet Point Generator</h3>
              <p className="text-xs text-slate-500">Enhance draft descriptions into impact-driven bullet points</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input area */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Draft Description</label>
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Created a bus tracking website."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Style / Focus Option</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'short', label: 'Short' },
                { id: 'professional', label: 'Professional' },
                { id: 'achievement', label: 'Achievement' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setMode(opt.id);
                    handleGenerate(opt.id);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    mode === opt.id
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={() => handleGenerate(mode)}
            disabled={loading || !inputText.trim()}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Bullet Point</span>
              </>
            )}
          </button>

          {/* Output Display */}
          {generatedBullet && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Output</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-brand-600"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                • {generatedBullet}
              </p>
              <button
                onClick={handleInsert}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Insert into Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Truth Guard Policy Banner */}
          <div className="flex items-center space-x-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>Truth Enforced:</strong> AI enhances sentence structure without inventing fake metrics or unverified credentials.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
