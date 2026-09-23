import React, { useState, useRef } from 'react';
import { Palette, CheckCircle2, ArrowRight, Mail, FileText, Upload } from 'lucide-react';
import { StorageService } from '../services/storageService';
import ResumePreview from '../components/ResumePreview';
import CoverLetterPreview from '../components/CoverLetterPreview';

// Sample data for realistic mini document previews
const SAMPLE_RESUME = {
  personalInfo: {
    fullName: 'Ajitha D R',
    subtitle: 'B.Tech – Information Technology',
    email: 'dajitha12@gmail.com',
    phone: '6374784776',
    location: 'Aruppukottai, Tamil Nadu',
    github: 'https://github.com/dajitha12-bot',
    linkedin: 'https://linkedin.com/in/ajitha-d-r',
    avatarUrl: '' // clean photo upload frame
  },
  summary: 'Motivated B.Tech IT student with strong skills in React, Java, and REST API development. Seeking internship opportunities in software development.',
  education: [
    { degree: 'B.Tech – Information Technology', institution: 'National Engineering College', year: '2024 – 2028', details: 'CGPA: 8.7' },
    { degree: 'Class XII – State Board', institution: 'SBK Girls Higher Secondary School', year: '2024', details: 'Percentage: 88%' }
  ],
  skills: {
    languages: ['Java', 'JavaScript', 'React', 'SQL', 'C++'],
    frameworks: ['Spring Boot', 'Node.js', 'Tailwind CSS']
  },
  projects: [
    { name: 'AI Resume Builder', duration: '2026', description: 'Interactive AI resume & cover letter builder with FlowCV engine.' }
  ]
};

const SAMPLE_COVER_LETTER = {
  sender: {
    fullName: 'Brian T. Wayne',
    jobTitle: 'Business Development Consultant',
    email: 'brian@wayne.com',
    phone: '+1 540 750 3010',
    location: 'Malibu, California, USA',
    linkedin: 'linkedin.com/in/wayne-2543',
    avatarUrl: '' // clean photo upload frame
  },
  recipient: {
    hiringManager: 'Ms. Wings',
    company: 'SugarCRM',
    address: '540 Market St PMB 19432, San Francisco, CA 94104',
    date: '14th June, 2026'
  },
  salutation: 'Dear Mrs. Wings,',
  opening: 'I am excited to apply for the Business Development Consultant position at your company. With a Master of Business Administration and several years of experience in business development, I am confident in my skills.',
  body: [
    'I have a proven track record of developing and implementing successful strategies that result in increased revenue and business growth. In my previous role, I developed and implemented strategic plans that resulted in a 30% increase in new business opportunities.',
    'During my time at Acme, I worked directly with tech and software companies to provide expert sales outsourcing services. I built and managed dedicated sales teams in Europe, the Americas, and Asia Pacific.'
  ],
  closing: 'Thank you for considering my application. I look forward to discussing how my background fits your team.',
  signoff: 'Sincerely,',
  signature: 'Brian T. Wayne'
};

export default function TemplatesPage({ resume, setResume, onNavigate, onEditCoverLetter, initialType = 'resumes', onTypeChange }) {
  const [activeType, setActiveType] = useState(initialType);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLetterTemplate, setSelectedLetterTemplate] = useState(null);
  const [newLetterName, setNewLetterName] = useState('');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType]);

  const handleTabChange = (type) => {
    setActiveType(type);
    if (onTypeChange) {
      onTypeChange(type);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let importedData;

        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(content);
        } else {
          importedData = {
            personalInfo: {
              fullName: 'Ajitha D R',
              subtitle: file.name.replace(/\.[^/.]+$/, ""),
              email: 'dajitha12@gmail.com',
              phone: '6374784776',
              location: 'Aruppukottai, Virudhunagar District, Tamil Nadu'
            },
            summary: content.slice(0, 300) || 'Imported resume contents',
            education: [
              { degree: 'B.Tech – Information Technology', institution: 'National Engineering College', year: '2024 – 2028', details: 'CGPA: 8.7' }
            ],
            skills: {
              languages: ['Java', 'JavaScript', 'React', 'SQL'],
              frameworks: ['Tailwind CSS', 'Node.js']
            }
          };
        }

        if (setResume) setResume(prev => ({ ...prev, ...importedData }));
        alert(`Resume "${file.name}" imported successfully! Opening Resume Editor.`);
        if (onNavigate) onNavigate('builder');
      } catch (err) {
        alert('Could not parse resume file. Please upload a valid JSON or text resume.');
      }
    };

    reader.readAsText(file);
  };

  const resumeTemplates = [
    { id: 'hunter_green', title: 'HUNTER GREEN', category: 'Two-Column' },
    { id: 'quicksilver', title: 'QUICKSILVER', category: 'Minimal' },
    { id: 'cobalt_edge', title: 'COBALT EDGE', category: 'Executive' },
    { id: 'atlantic_blue', title: 'ATLANTIC BLUE', category: 'Modern' },
    { id: 'mercury_flow', title: 'MERCURY FLOW', category: 'Two-Column' },
    { id: 'saffron_line', title: 'SAFFRON LINE', category: 'Classic' },
    { id: 'classic_serif', title: 'CLASSIC SERIF', category: 'Classic' },
    { id: 'minimal', title: 'MINIMALIST', category: 'Minimal' },
    { id: 'software_developer', title: 'SOFTWARE DEVELOPER', category: 'Developer' },
    { id: 'creative', title: 'CREATIVE', category: 'Creative' }
  ];

  const coverLetterTemplates = [
    { id: 'dark_leaves', title: 'DARK LEAVES · COVER LETTER WITH BORDER', category: 'Bordered' },
    { id: 'lara_miller', title: 'LARA MILLER · PLUM PURPLE HEADER COVER LETTER', category: 'Header Banner' },
    { id: 'anna_field', title: 'ANNA FIELD · MINT TEAL ACCENT COVER LETTER', category: 'Modern' },
    { id: 'andrew_osullivan', title: 'ANDREW O\'SULLIVAN · ELEGANT SERIF COVER LETTER', category: 'Formal' },
    { id: 'desert_rock', title: 'DESERT ROCK · TWO-COLUMN COVER LETTER', category: 'Two-Column' },
    { id: 'gold_minimal', title: 'GOLD · MINIMALISTIC COVER LETTER WITH BORDER', category: 'Minimal' },
    { id: 'hunter_green', title: 'HUNTER GREEN · MULTI-COLUMN COVER LETTER', category: 'Multi-Column' },
    { id: 'viola_purple', title: 'VIOLA · MINIMALISTIC COVER LETTER', category: 'Minimal' },
    { id: 'modern_blue', title: 'MODERN SKY BLUE · ACCENT LINE COVER LETTER', category: 'Modern' },
    { id: 'corporate_navy', title: 'CORPORATE NAVY · BANNER COVER LETTER', category: 'Corporate' }
  ];

  const handleApplyResume = (templateId) => {
    if (setResume) setResume(prev => ({ ...prev, template: templateId }));
    if (onNavigate) onNavigate('builder');
  };

  const handleOpenCoverLetterModal = (template) => {
    setSelectedLetterTemplate(template);
    setNewLetterName(`${template.id.replace('_', ' ').toUpperCase()} Cover Letter`);
    setModalOpen(true);
  };

  const handleCreateCoverLetterFromTemplate = (e) => {
    e.preventDefault();
    if (!newLetterName.trim() || !selectedLetterTemplate) return;

    const newRecord = StorageService.createRecord('cover_letters', {
      name: newLetterName.trim(),
      template: selectedLetterTemplate.id,
      sender: {
        fullName: 'Ajitha D R',
        jobTitle: 'B.Tech – Information Technology',
        email: 'dajitha12@gmail.com',
        phone: '6374784776',
        location: 'Aruppukottai, Virudhunagar District, Tamil Nadu',
        avatarUrl: '',
        linkedin: 'linkedin.com/in/ajitha-d-r-b3697b323',
        github: 'https://github.com/dajitha12-bot'
      },
      recipient: {
        hiringManager: 'Hiring Manager',
        company: 'Target Company',
        address: 'Company Location, Country',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      },
      salutation: 'Dear Hiring Manager,',
      opening: 'I am excited to apply for the position at your company. With a strong background in software engineering and web development, I am confident in my ability to add immediate value to your team.',
      body: [
        'Throughout my academic career at National Engineering College, I have gained hands-on experience in building modern web applications, scalable backend APIs, and responsive UI components.',
        'I am impressed by your company\'s commitment to innovation and look forward to contributing my technical skills and enthusiasm to your projects.'
      ],
      closing: 'Thank you for considering my application. I welcome the opportunity to discuss my qualifications further in an interview.',
      signoff: 'Sincerely,',
      signature: 'Ajitha D R'
    }, 'cl');

    setModalOpen(false);
    if (onEditCoverLetter) onEditCoverLetter(newRecord.id);
    if (onNavigate) onNavigate('cover-letter-builder');
  };

  const activeResumeTemplate = resume?.template || 'classic_serif';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50/50 min-h-screen">
      
      {/* Header Banner matching FlowCV */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>FlowCV Template Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Choose Your Template</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            100% free, all features, unlimited PDF downloads. Match your Resume and Cover Letter with matching visual designs.
          </p>
        </div>

        {/* Tab Toggle (Resumes first, Cover Letters second) */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => handleTabChange('resumes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeType === 'resumes'
                ? 'bg-white text-sky-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resumes ({resumeTemplates.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('cover_letters')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeType === 'cover_letters'
                ? 'bg-white text-sky-600 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Cover Letters ({coverLetterTemplates.length})</span>
          </button>
        </div>
      </div>

      {/* COVER LETTER TEMPLATES GALLERY (FlowCV Document Cards Layout) */}
      {activeType === 'cover_letters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coverLetterTemplates.map(tpl => (
            <div 
              key={tpl.id}
              onClick={() => handleOpenCoverLetterModal(tpl)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 hover:ring-4 hover:ring-sky-500/10 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
            >
              {/* Live Scaled Document Preview Box */}
              <div className="h-80 bg-[#f8f9fa] p-4 relative overflow-hidden flex justify-center border-b border-slate-100 items-start">
                <div className="transform scale-[0.32] origin-top w-[800px] pointer-events-none select-none shadow-md rounded border border-slate-200">
                  <CoverLetterPreview data={SAMPLE_COVER_LETTER} template={tpl.id} />
                </div>
                
                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg transform group-hover:scale-105 transition">
                    Use This Template ✨
                  </span>
                </div>
              </div>

              {/* Card Footer Caption (Exact FlowCV Style: Title uppercase in grey font) */}
              <div className="p-4 bg-white flex flex-col justify-between items-center text-center">
                <p className="text-[11px] font-bold text-slate-500 group-hover:text-sky-600 tracking-wider uppercase transition">
                  {tpl.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESUME TEMPLATES GALLERY (FlowCV Document Cards Layout) */}
      {activeType === 'resumes' && (
        <div className="space-y-6">
          {/* Top Right Action Bar matching screenshot media_1790203727784.png */}
          <div className="flex justify-end items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,.txt,.pdf,.docx"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="border-2 border-slate-900 bg-white hover:bg-slate-50 text-slate-900 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Import existing resume</span>
            </button>
          </div>

          {/* Resumes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeTemplates.map(tpl => {
              const isSelected = activeResumeTemplate === tpl.id;
              return (
                <div 
                  key={tpl.id}
                  onClick={() => handleApplyResume(tpl.id)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                    isSelected
                      ? 'border-sky-500 ring-4 ring-sky-500/20 shadow-xl'
                      : 'border-slate-200/90 hover:border-sky-500 hover:ring-4 hover:ring-sky-500/10 shadow-sm hover:shadow-xl'
                  }`}
                >
                  {/* Live Scaled Document Preview Box */}
                  <div className="h-80 bg-[#f8f9fa] p-4 relative overflow-hidden flex justify-center border-b border-slate-100 items-start">
                    <div className="transform scale-[0.32] origin-top w-[800px] pointer-events-none select-none shadow-md rounded border border-slate-200">
                      <ResumePreview resume={SAMPLE_RESUME} template={tpl.id} zoom={100} />
                    </div>
                    
                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg transform group-hover:scale-105 transition">
                        {isSelected ? 'Open in Resume Editor ✏️' : 'Use This Template ✨'}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Caption */}
                  <div className="p-4 bg-white flex justify-between items-center">
                    <p className="text-[11px] font-bold text-slate-500 group-hover:text-sky-600 tracking-wider uppercase transition">
                      {tpl.title}
                    </p>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE COVER LETTER FROM TEMPLATE MODAL */}
      {modalOpen && selectedLetterTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">
                Create Cover Letter with {selectedLetterTemplate.id.replace('_', ' ').toUpperCase()}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCoverLetterFromTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cover Letter Name / Target Position
                </label>
                <input
                  type="text"
                  value={newLetterName}
                  onChange={(e) => setNewLetterName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow"
                >
                  Create & Open Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
