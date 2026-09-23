import React from 'react';
import { Palette, Type, Sliders, Layout, Check, Sparkles } from 'lucide-react';

export default function CustomizeTab({ customizeOptions, setCustomizeOptions, resume, setResume }) {
  const options = customizeOptions || {
    fontFamily: 'Inter',
    fontSize: '11px',
    headingStyle: 'solid_bar',
    lineSpacing: '1.4',
    sectionSpacing: '12px',
    margins: '0.4in',
    accentColor: '#3b82f6',
    onePage: true
  };

  const updateOption = (key, val) => {
    setCustomizeOptions(prev => ({ ...prev, [key]: val }));
  };

  const fonts = [
    { name: 'Inter (Sans-serif)', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Merriweather (Serif)', value: 'Merriweather' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Fira Code (Monospace)', value: 'Fira Code' },
    { name: 'Outfit', value: 'Outfit' }
  ];

  const colors = [
    { label: 'Primary Blue', hex: '#3b82f6' },
    { label: 'Soft Lavender', hex: '#8b5cf6' },
    { label: 'Emerald Green', hex: '#10b981' },
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Rose Red', hex: '#f43f5e' },
    { label: 'Charcoal Dark', hex: '#334155' },
    { label: 'Deep Teal', hex: '#0d9488' }
  ];

  const headings = [
    { id: 'solid_bar', label: 'Solid Accent Bar' },
    { id: 'underlined', label: 'Bottom Border' },
    { id: 'left_border', label: 'Left Accent Border' },
    { id: 'bold_uppercase', label: 'Bold Uppercase' },
    { id: 'serif_classic', label: 'Classic Serif Rule' }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-800">
      
      {/* Template Selector */}
      <div className="space-y-2">
        <label className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Template Layout</label>
        <select
          value={resume?.template || 'modern'}
          onChange={(e) => setResume(prev => ({ ...prev, template: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="modern">Modern Professional</option>
          <option value="professional">Professional ATS</option>
          <option value="minimal">Minimalist Clean</option>
          <option value="executive">Executive Senior</option>
          <option value="creative">Creative Designer</option>
          <option value="fresher">Fresher Student</option>
          <option value="software_developer">Software Developer</option>
          <option value="academic">Academic & Research</option>
        </select>
      </div>

      {/* Accent Color Palette */}
      <div className="space-y-2">
        <label className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Accent Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <button
              key={c.hex}
              onClick={() => updateOption('accentColor', c.hex)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${
                options.accentColor === c.hex ? 'border-slate-900 shadow-md scale-105' : 'border-white'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            >
              {options.accentColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Font Family</label>
        <select
          value={options.fontFamily}
          onChange={(e) => updateOption('fontFamily', e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-slate-50 outline-none"
        >
          {fonts.map(f => (
            <option key={f.value} value={f.value}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Heading Style */}
      <div className="space-y-2">
        <label className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Heading Style</label>
        <div className="grid grid-cols-2 gap-2">
          {headings.map(h => (
            <button
              key={h.id}
              onClick={() => updateOption('headingStyle', h.id)}
              className={`p-2 rounded-xl border text-left font-medium transition-all ${
                options.headingStyle === h.id
                  ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size & Line Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px]">Body Font Size</label>
          <select
            value={options.fontSize}
            onChange={(e) => updateOption('fontSize', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            <option value="10px">Small (10px)</option>
            <option value="11px">Normal (11px)</option>
            <option value="12px">Large (12px)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px]">Line Spacing</label>
          <select
            value={options.lineSpacing}
            onChange={(e) => updateOption('lineSpacing', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            <option value="1.2">Tight (1.2)</option>
            <option value="1.4">Normal (1.4)</option>
            <option value="1.6">Relaxed (1.6)</option>
          </select>
        </div>
      </div>

      {/* Margins & Section Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px]">Page Margins</label>
          <select
            value={options.margins}
            onChange={(e) => updateOption('margins', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            <option value="0.25in">Narrow (0.25in)</option>
            <option value="0.4in">Normal (0.4in)</option>
            <option value="0.5in">Wide (0.5in)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700 text-[11px]">Section Gap</label>
          <select
            value={options.sectionSpacing}
            onChange={(e) => updateOption('sectionSpacing', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            <option value="8px">Compact (8px)</option>
            <option value="12px">Normal (12px)</option>
            <option value="16px">Spaced (16px)</option>
          </select>
        </div>
      </div>

      {/* One-Page A4 Optimization Toggle */}
      <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center justify-between">
        <div>
          <span className="font-bold text-slate-900 block text-xs">One-Page A4 Optimization</span>
          <p className="text-[10px] text-slate-500">Automatically scales line height & padding to fit complete resume into 1 page.</p>
        </div>
        <input
          type="checkbox"
          checked={options.onePage}
          onChange={(e) => updateOption('onePage', e.target.checked)}
          className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
        />
      </div>

    </div>
  );
}
