import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Check, 
  Copy, 
  RefreshCw,
  MessageSquare,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AICareerAssistant({ resume }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello Ajitha! I am your AI Career Assistant. I have loaded your current resume and Career Vault data. How can I assist you with interview preparation or cover letter generation today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'cover-letter' | 'chat'

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMsg = { sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    setTimeout(() => {
      const reply = {
        sender: 'assistant',
        text: `Based on your resume claims in Java and Spring Boot, I recommend highlighting your work on the Smart University Event Management system. Make sure to emphasize transactional safety and SQL query tuning.`
      };
      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const handleGenerateInterview = async () => {
    setLoading(true);
    try {
      const res = await api.generateInterviewQuestions(resume);
      setInterviewQuestions(res.questions);
      setActiveTab('interview');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await api.generateCoverLetter(resume);
      setCoverLetter(res.coverLetter);
      setActiveTab('cover-letter');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Resume-to-Interview AI Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Career Assistant & Interview Prep</h1>
          <p className="text-xs text-slate-500">Generate targeted interview questions from your actual resume bullet points and craft personalized cover letters.</p>
        </div>

        {/* Action Shortcut Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateInterview}
            disabled={loading}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Generate Interview Questions</span>
          </button>

          <button
            onClick={handleGenerateCoverLetter}
            disabled={loading}
            className="px-4 py-2.5 bg-lavender-600 hover:bg-lavender-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Cover Letter</span>
          </button>
        </div>
      </div>

      {/* Mode Sub-Navigation */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'interview' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Resume-to-Interview Questions
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cover-letter' ? 'bg-lavender-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Personalized Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'chat' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Interactive Chat
        </button>
      </div>

      {/* Tab Content 1: Resume-to-Interview Questions */}
      {activeTab === 'interview' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Personalized Interview Q&A (From Your Resume)</h3>
              <p className="text-xs text-slate-500">Categorized into Basic, Intermediate, and Advanced difficulty</p>
            </div>
            <button
              onClick={handleGenerateInterview}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Questions
            </button>
          </div>

          {!interviewQuestions && (
            <div className="p-8 text-center text-xs text-slate-400">
              Click "Generate Interview Questions" above to synthesize personalized interview prompts from your resume.
            </div>
          )}

          {interviewQuestions && (
            <div className="space-y-4">
              {['Basic', 'Intermediate', 'Advanced'].map(cat => {
                const catQuestions = interviewQuestions.filter(q => q.category === cat);
                if (catQuestions.length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat === 'Basic' ? 'bg-emerald-100 text-emerald-800' : cat === 'Intermediate' ? 'bg-brand-100 text-brand-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {cat} Level Questions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {catQuestions.map((q, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Based on: {q.claim}</span>
                          <h4 className="font-bold text-slate-900 text-xs leading-relaxed">{q.question}</h4>
                          <p className="text-[11px] text-brand-600 font-medium pt-1 border-t border-slate-200/60">
                            Expected Focus: {q.expectedFocus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: AI Cover Letter */}
      {activeTab === 'cover-letter' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Personalized Cover Letter</h3>
              <p className="text-xs text-slate-500">Only incorporates ground-truth facts verified in your Career Vault</p>
            </div>
            {coverLetter && (
              <button
                onClick={handleCopyCoverLetter}
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg text-xs font-bold flex items-center gap-1 border border-brand-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Cover Letter'}</span>
              </button>
            )}
          </div>

          {!coverLetter && (
            <div className="p-8 text-center text-xs text-slate-400">
              Click "Generate Cover Letter" above to craft a custom application letter.
            </div>
          )}

          {coverLetter && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {coverLetter}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Interactive Chat Interface */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Career Assistant Chat</h4>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Context Synced</span>
          </div>

          {/* Messages feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
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
              placeholder="Ask how to answer specific interview questions..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
