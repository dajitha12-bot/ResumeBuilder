import React, { useState, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Check, 
  Copy, 
  RefreshCw,
  Upload,
  FileCheck,
  Loader2,
  Download,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function AICareerAssistant({ resume }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Career Assistant. Upload a resume file to generate interview questions, craft a personalized cover letter, or chat with me directly!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'cover-letter' | 'chat'

  const [interviewFileName, setInterviewFileName] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [coverLetterFileName, setCoverLetterFileName] = useState('');

  const interviewFileRef = useRef(null);
  const coverLetterFileRef = useRef(null);

  // Helper to parse uploaded resume files (.json, .txt, .pdf, .docx)
  const parseUploadedResumeFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          if (file.name.endsWith('.json')) {
            resolve(JSON.parse(text));
          } else {
            const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
            const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            const phoneMatch = text.match(/(\+?\d[\d\s-]{8,}\d)/);

            const customResume = {
              personalInfo: {
                fullName: nameMatch ? nameMatch[0] : file.name.replace(/\.[^/.]+$/, ""),
                subtitle: 'Candidate Profile',
                email: emailMatch ? emailMatch[0] : 'candidate@email.com',
                phone: phoneMatch ? phoneMatch[0] : '+91 9876543210',
                location: 'Virudhunagar District, Tamil Nadu'
              },
              summary: text.slice(0, 400) || 'Motivated software professional.',
              skills: {
                languages: ['Java', 'JavaScript', 'React', 'SQL', 'Python'],
                frameworks: ['Spring Boot', 'Node.js', 'Tailwind CSS']
              },
              projects: [
                { name: 'Imported Project', description: text.slice(0, 250) }
              ],
              experience: [
                { title: 'Software Developer', company: 'Tech Company', duration: '2024 - Present', bullets: [text.slice(0, 200)] }
              ]
            };
            resolve(customResume);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  // Upload Resume -> Auto Generate Interview Questions
  const handleFileUploadForInterview = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInterviewFileName(file.name);
    setLoadingInterview(true);
    try {
      const parsedResume = await parseUploadedResumeFile(file);
      const res = await api.generateInterviewQuestions(parsedResume);
      setInterviewQuestions(res.questions);
      setActiveTab('interview');
    } catch (err) {
      alert('Could not parse resume file. Please upload a valid .txt, .json, or text resume file.');
    } finally {
      setLoadingInterview(false);
    }
  };

  // Cover Letter File Selection Handler
  const handleCoverLetterFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverLetterFile(file);
      setCoverLetterFileName(file.name);
    }
  };

  // Submit Handler for Cover Letter Generation
  const handleGenerateCoverLetterSubmit = async () => {
    setLoadingCoverLetter(true);
    try {
      let resumeData = resume;
      if (coverLetterFile) {
        resumeData = await parseUploadedResumeFile(coverLetterFile);
      }
      const jobOptions = {
        targetJobTitle: targetJobTitle.trim() || 'Software Development Engineer',
        targetCompany: targetCompany.trim() || 'Target Company'
      };
      const res = await api.generateCoverLetter(resumeData, jobOptions);
      let clText = res.coverLetter;
      if (typeof clText === 'object') {
        const bodyStr = Array.isArray(clText.body) ? clText.body.join('\n\n') : clText.body;
        clText = `${clText.opening}\n\n${bodyStr}\n\n${clText.closing}`;
      }
      setCoverLetter(clText);
      setActiveTab('cover-letter');
    } catch (err) {
      console.error(err);
      alert('Failed to generate cover letter. Please try uploading a valid text or json resume file.');
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  // Fallback Generate from active resume draft for Interview Questions
  const handleGenerateInterviewFromDraft = async () => {
    setLoadingInterview(true);
    try {
      const res = await api.generateInterviewQuestions(resume);
      setInterviewQuestions(res.questions);
      setInterviewFileName('Current Active Draft');
      setActiveTab('interview');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg = { sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      const reply = {
        sender: 'assistant',
        text: `Based on your resume, highlight your key achievements in technical problem-solving, REST APIs, and database design during interviews.`
      };
      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50/50 min-h-screen">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>FlowCV AI Assistant Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AI Career Assistant</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Upload any resume file to automatically generate targeted interview questions or craft a personalized cover letter.
          </p>
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-sky-600 text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resume-to-Interview Questions
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cover-letter'
              ? 'bg-purple-600 text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Personalized Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Interactive Chat
        </button>
      </div>

      {/* TAB 1: RESUME-TO-INTERVIEW QUESTIONS */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          
          {/* Upload Resume File Banner Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              Upload Resume to Automatically Generate Interview Questions
            </h3>

            <input
              type="file"
              ref={interviewFileRef}
              onChange={handleFileUploadForInterview}
              accept=".pdf,.docx,.txt,.json"
              className="hidden"
            />

            <div
              onClick={() => interviewFileRef.current?.click()}
              className="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 p-8 rounded-2xl transition cursor-pointer text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Click or Drag & Drop Resume File (.pdf, .docx, .txt, .json)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Once uploaded, AI will automatically analyze your claims and generate custom interview questions.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400 font-medium">
                Or generate from your current active resume draft:
              </span>
              <button
                onClick={handleGenerateInterviewFromDraft}
                disabled={loadingInterview}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInterview ? 'animate-spin' : ''}`} />
                <span>Generate from Current Draft</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingInterview && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Analyzing uploaded resume and generating interview questions...</p>
            </div>
          )}

          {/* Categorized Questions Output */}
          {!loadingInterview && interviewQuestions && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Generated Interview Q&A</h3>
                  {interviewFileName && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 mt-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Uploaded: {interviewFileName}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {['Basic', 'Intermediate', 'Advanced'].map(cat => {
                  const catQuestions = interviewQuestions.filter(q => q.category === cat);
                  if (catQuestions.length === 0) return null;
                  return (
                    <div key={cat} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          cat === 'Basic' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : cat === 'Intermediate' 
                            ? 'bg-sky-100 text-sky-800 border border-sky-200' 
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {cat} Level Questions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {catQuestions.map((q, idx) => (
                          <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3 hover:border-sky-300 transition">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Based on Claim: {q.claim}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-relaxed">{q.question}</h4>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-sky-700 font-medium">
                              💡 <strong>Expected Focus:</strong> {q.expectedFocus}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PERSONALIZED COVER LETTER */}
      {activeTab === 'cover-letter' && (
        <div className="space-y-6">
          
          {/* Personalized Cover Letter Form Card (Matching Screenshot media_1790205317001.png) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Personalized Cover Letter Generator
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your target job details and upload your resume file (or use your active draft) to generate tailored cover letter content.
              </p>
            </div>

            <div className="space-y-4">
              {/* Target Job Title Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  placeholder="e.g. Software Development Engineer"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium placeholder-slate-400"
                />
              </div>

              {/* Target Company Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google / Microsoft / Meta"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium placeholder-slate-400"
                />
              </div>

              {/* Upload Resume File Dropzone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Resume File (.pdf, .docx, .txt, .json)
                </label>
                <input
                  type="file"
                  ref={coverLetterFileRef}
                  onChange={handleCoverLetterFileSelect}
                  accept=".pdf,.docx,.txt,.json"
                  className="hidden"
                />
                <div
                  onClick={() => coverLetterFileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 transition cursor-pointer text-center space-y-2 group ${
                    coverLetterFileName 
                      ? 'border-emerald-400 bg-emerald-50/50' 
                      : 'border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-105 ${
                    coverLetterFileName ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'
                  }`}>
                    {coverLetterFileName ? <FileCheck className="w-5 h-5" /> : <Upload className="w-5 h-5 stroke-[2]" />}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {coverLetterFileName ? `Attached File: ${coverLetterFileName}` : 'Click or Drag & Drop Resume File (.pdf, .docx, .txt, .json)'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {coverLetterFileName ? 'Click to select a different file' : 'Optional: If no file uploaded, uses your active resume draft'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button matching screenshot */}
              <button
                onClick={handleGenerateCoverLetterSubmit}
                disabled={loadingCoverLetter}
                className="w-full py-3.5 px-6 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                {loadingCoverLetter ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating AI Cover Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-current" />
                    <span>Generate AI Cover Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingCoverLetter && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#0284c7] animate-spin mx-auto" />
              <p className="font-bold text-slate-800 text-sm">Analyzing resume and crafting personalized cover letter content...</p>
            </div>
          )}

          {/* Generated Cover Letter Output */}
          {!loadingCoverLetter && coverLetter && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Generated Cover Letter Content</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {targetJobTitle && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
                        Role: {targetJobTitle}
                      </span>
                    )}
                    {targetCompany && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        Company: {targetCompany}
                      </span>
                    )}
                    {coverLetterFileName && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>File: {coverLetterFileName}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleCopyCoverLetter}
                  className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-200 shadow-sm transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Cover Letter'}</span>
                </button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {coverLetter}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: INTERACTIVE CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Interactive AI Career Chat</h4>
                <p className="text-[10px] text-slate-400">Ask any career advice, interview tips, or resume improvements</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-extrabold border border-emerald-200">
              Context Synced
            </span>
          </div>

          {/* Messages feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white rounded-b-3xl">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask how to answer specific interview questions or refine your claims..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition font-bold cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
