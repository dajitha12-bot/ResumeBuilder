import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import CoverLetterPreview from '../components/CoverLetterPreview';
import { exportToPDF } from '../utils/exportUtils';
import { generateCoverLetter } from '../services/aiService';

const TEMPLATES = [
  { id: 'desert_rock', name: 'Desert Rock', desc: 'Two-column layout with beige sidebar & photo' },
  { id: 'gold_minimal', name: 'Gold Minimal', desc: 'Gold border frame & inline header' },
  { id: 'hunter_green', name: 'Hunter Green', desc: 'Multi-column with sage green sidebar' },
  { id: 'viola_purple', name: 'Viola Purple', desc: 'Dark purple header banner' },
  { id: 'modern_blue', name: 'Modern Blue', desc: 'Clean blue accent header line' },
  { id: 'executive_classic', name: 'Executive Classic', desc: 'Formal serif typography' }
];

export default function CoverLetterBuilder({ letterId, onNavigate }) {
  const [letterData, setLetterData] = useState(null);
  const [activeTab, setActiveTab] = useState('sender');
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiCompanyName, setAiCompanyName] = useState('');

  useEffect(() => {
    const list = StorageService.getCollection('cover_letters');
    let record = null;
    if (letterId) {
      record = list.find(item => item.id === letterId);
    }
    if (!record && list.length > 0) {
      record = list[0];
    }
    if (record) {
      setLetterData(record);
    } else {
      if (onNavigate) onNavigate('cover-letters');
    }
  }, [letterId]);

  if (!letterData) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading cover letter editor...
      </div>
    );
  }

  const updateLetter = (field, value) => {
    const updated = { ...letterData, [field]: value };
    setLetterData(updated);
    StorageService.updateById('cover_letters', letterData.id, { [field]: value });
  };

  const updateNestedField = (parent, field, value) => {
    const updatedParent = { ...letterData[parent], [field]: value };
    const updated = { ...letterData, [parent]: updatedParent };
    setLetterData(updated);
    StorageService.updateById('cover_letters', letterData.id, { [parent]: updatedParent });
  };

  const handleBodyParagraphChange = (index, value) => {
    const newBody = [...(letterData.body || [])];
    newBody[index] = value;
    updateLetter('body', newBody);
  };

  const addBodyParagraph = () => {
    const newBody = [...(letterData.body || []), ''];
    updateLetter('body', newBody);
  };

  const removeBodyParagraph = (index) => {
    const newBody = (letterData.body || []).filter((_, i) => i !== index);
    updateLetter('body', newBody);
  };

  const handleAiDraft = async () => {
    if (!aiJobTitle.trim() || !aiCompanyName.trim()) {
      alert('Please enter a target Job Title and Company Name for the AI generator.');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateCoverLetter({
        senderName: letterData.sender?.fullName || 'Ajitha D R',
        jobTitle: aiJobTitle,
        companyName: aiCompanyName
      });
      if (result) {
        updateLetter('opening', result.opening || letterData.opening);
        updateLetter('body', result.body || letterData.body);
        updateLetter('closing', result.closing || letterData.closing);
        updateNestedField('recipient', 'company', aiCompanyName);
      }
    } catch (err) {
      console.error(err);
      alert('AI Generation failed. Falling back to structured cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('cover-letter-preview', `${letterData.name || 'Cover_Letter'}.pdf`);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      {/* Top Action Bar */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate && onNavigate('cover-letters')}
            className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center gap-1"
          >
            ← Back to Cover Letters
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <input
            type="text"
            value={letterData.name || ''}
            onChange={(e) => updateLetter('name', e.target.value)}
            className="font-bold text-slate-800 text-lg bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded px-2 py-1 outline-none transition"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? 'Generating PDF...' : '📥 Download PDF'}
          </button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Panel */}
        <div className="w-full md:w-1/2 lg:w-5/12 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold text-slate-600 shrink-0">
            <button
              onClick={() => setActiveTab('sender')}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === 'sender' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              👤 Sender
            </button>
            <button
              onClick={() => setActiveTab('recipient')}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === 'recipient' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              🏢 Recipient
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === 'content' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              ✍️ Letter Body
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === 'ai' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              🤖 AI Draft
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === 'template' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
              }`}
            >
              🎨 Template
            </button>
          </div>

          {/* Tab Content Areas */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 text-left text-sm">
            {/* SENDER INFO TAB */}
            {activeTab === 'sender' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b pb-2">Sender Information</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={letterData.sender?.fullName || ''}
                    onChange={(e) => updateNestedField('sender', 'fullName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title / Subtitle</label>
                  <input
                    type="text"
                    value={letterData.sender?.jobTitle || ''}
                    onChange={(e) => updateNestedField('sender', 'jobTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Profile Photo Upload</label>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {letterData.sender?.avatarUrl ? (
                      <img src={letterData.sender.avatarUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-sky-400 bg-sky-50 flex items-center justify-center text-sky-600 text-xs font-bold shrink-0">
                        📷
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateNestedField('sender', 'avatarUrl', reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
                      />
                      {letterData.sender?.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => updateNestedField('sender', 'avatarUrl', '')}
                          className="text-[10px] text-red-500 hover:underline block font-semibold"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Or Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/photo.jpg"
                    value={letterData.sender?.avatarUrl || ''}
                    onChange={(e) => updateNestedField('sender', 'avatarUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={letterData.sender?.email || ''}
                      onChange={(e) => updateNestedField('sender', 'email', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={letterData.sender?.phone || ''}
                      onChange={(e) => updateNestedField('sender', 'phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address / Location</label>
                  <input
                    type="text"
                    value={letterData.sender?.location || ''}
                    onChange={(e) => updateNestedField('sender', 'location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={letterData.sender?.linkedin || ''}
                      onChange={(e) => updateNestedField('sender', 'linkedin', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub / Portfolio</label>
                    <input
                      type="text"
                      value={letterData.sender?.github || ''}
                      onChange={(e) => updateNestedField('sender', 'github', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RECIPIENT TAB */}
            {activeTab === 'recipient' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b pb-2">Recipient Information</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Hiring Manager Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ms. Wings or Hiring Manager"
                    value={letterData.recipient?.hiringManager || ''}
                    onChange={(e) => updateNestedField('recipient', 'hiringManager', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Meta Platforms Inc."
                    value={letterData.recipient?.company || ''}
                    onChange={(e) => updateNestedField('recipient', 'company', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Company Address</label>
                  <textarea
                    rows={3}
                    placeholder="Company street, city, country"
                    value={letterData.recipient?.address || ''}
                    onChange={(e) => updateNestedField('recipient', 'address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Letter Date</label>
                  <input
                    type="text"
                    value={letterData.recipient?.date || ''}
                    onChange={(e) => updateNestedField('recipient', 'date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* LETTER CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b pb-2">Letter Content</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Salutation</label>
                  <input
                    type="text"
                    value={letterData.salutation || ''}
                    onChange={(e) => updateLetter('salutation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Opening Paragraph</label>
                  <textarea
                    rows={3}
                    value={letterData.opening || ''}
                    onChange={(e) => updateLetter('opening', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-600">Body Paragraphs</label>
                    <button
                      type="button"
                      onClick={addBodyParagraph}
                      className="text-xs text-sky-600 hover:text-sky-700 font-bold"
                    >
                      + Add Paragraph
                    </button>
                  </div>
                  {(letterData.body || []).map((paragraph, index) => (
                    <div key={index} className="relative">
                      <textarea
                        rows={3}
                        value={paragraph}
                        onChange={(e) => handleBodyParagraphChange(index, e.target.value)}
                        className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      {(letterData.body || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBodyParagraph(index)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Closing Paragraph</label>
                  <textarea
                    rows={3}
                    value={letterData.closing || ''}
                    onChange={(e) => updateLetter('closing', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Sign-off Phrase</label>
                    <input
                      type="text"
                      value={letterData.signoff || ''}
                      onChange={(e) => updateLetter('signoff', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Signature Name</label>
                    <input
                      type="text"
                      value={letterData.signature || ''}
                      onChange={(e) => updateLetter('signature', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AI DRAFT TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl">
                  <h3 className="font-bold text-sky-900 text-base mb-1">🤖 AI Cover Letter Generator</h3>
                  <p className="text-xs text-sky-700">
                    Instantly draft a tailored cover letter based on your target role and company.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Development Engineer"
                    value={aiJobTitle}
                    onChange={(e) => setAiJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google / Microsoft / Meta"
                    value={aiCompanyName}
                    onChange={(e) => setAiCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAiDraft}
                  disabled={isGenerating}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? 'Drafting Cover Letter...' : '✨ Generate AI Cover Letter'}
                </button>
              </div>
            )}

            {/* TEMPLATE PICKER TAB */}
            {activeTab === 'template' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-base border-b pb-2">Select FlowCV Template</h3>
                <div className="grid grid-cols-1 gap-3">
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => updateLetter('template', tmpl.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                        (letterData.template || 'desert_rock') === tmpl.id
                          ? 'border-sky-600 bg-sky-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{tmpl.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{tmpl.desc}</p>
                      </div>
                      {(letterData.template || 'desert_rock') === tmpl.id && (
                        <span className="text-sky-600 font-bold text-lg">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="hidden md:flex flex-1 bg-slate-200 p-8 overflow-y-auto items-start justify-center">
          <div className="shadow-2xl rounded overflow-hidden transform hover:scale-[1.005] transition">
            <CoverLetterPreview data={letterData} template={letterData.template || 'desert_rock'} />
          </div>
        </div>
      </div>
    </div>
  );
}
