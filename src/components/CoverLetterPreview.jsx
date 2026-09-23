import React from 'react';
import { Camera } from 'lucide-react';

export default function CoverLetterPreview({ data, template = 'desert_rock' }) {
  if (!data) return null;

  const {
    sender = {},
    recipient = {},
    salutation = 'Dear Hiring Manager,',
    opening = '',
    body = [],
    closing = '',
    signoff = 'Sincerely,',
    signature = ''
  } = data;

  const paragraphs = Array.isArray(body) ? body : [body];

  // Render photo or dashed upload frame
  const renderPhotoFrame = (sizeClass = "w-24 h-24", roundedClass = "rounded-full", borderClass = "border-2 border-slate-300") => {
    const photoUrl = sender.avatarUrl || sender.avatar;
    if (photoUrl) {
      return (
        <img
          src={photoUrl}
          alt={sender.fullName || "Sender"}
          className={`${sizeClass} ${roundedClass} ${borderClass} object-cover shadow-sm shrink-0`}
        />
      );
    }
    return (
      <div className={`${sizeClass} ${roundedClass} border-2 border-dashed border-sky-400 bg-sky-50/80 flex flex-col items-center justify-center text-sky-600 hover:bg-sky-100/80 transition cursor-pointer shrink-0 shadow-sm`}>
        <Camera className="w-5 h-5 mb-0.5 text-sky-600" />
        <span className="text-[9px] font-bold tracking-tight">Add Photo</span>
      </div>
    );
  };

  // Helper to render body paragraphs cleanly
  const renderLetterBody = (textColor = 'text-gray-700') => (
    <div className={`space-y-4 ${textColor} text-sm leading-relaxed text-justify`}>
      {opening && <p>{opening}</p>}
      {paragraphs.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
      {closing && <p>{closing}</p>}
    </div>
  );

  // TEMPLATE 1: DESERT ROCK (Two-Column Layout)
  if (template === 'desert_rock') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg flex border border-gray-200 text-left font-sans">
        {/* Left Column (Warm Desert Beige Sidebar) */}
        <div className="w-1/3 bg-[#e8e0d5] p-6 flex flex-col items-center text-center border-r border-[#d4c8b8]">
          {renderPhotoFrame("w-28 h-28", "rounded-full", "border-4 border-white")}

          <h1 className="text-xl font-bold text-[#2d2926] tracking-tight mt-4">{sender.fullName}</h1>
          <p className="text-xs font-semibold text-[#6e5d4f] mt-1 mb-6 uppercase tracking-wider">{sender.jobTitle}</p>

          <div className="w-full border-t border-[#d4c8b8] pt-6 space-y-3 text-left text-xs text-[#4a4036]">
            {sender.email && <div className="truncate">✉ {sender.email}</div>}
            {sender.phone && <div>📞 {sender.phone}</div>}
            {sender.location && <div>📍 {sender.location}</div>}
            {sender.linkedin && <div className="truncate">🔗 {sender.linkedin}</div>}
            {sender.github && <div className="truncate">💻 {sender.github}</div>}
          </div>
        </div>

        {/* Right Column (Letter Body) */}
        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            <div className="mb-6 text-xs text-gray-600 space-y-1">
              {recipient.date && <p className="font-semibold text-gray-500 mb-4">{recipient.date}</p>}
              {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
              {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
            </div>

            <p className="font-bold text-gray-900 mb-4">{salutation}</p>
            {renderLetterBody()}
          </div>

          <div className="mt-8 pt-4">
            <p className="text-sm font-semibold text-gray-700">{signoff}</p>
            <p className="text-base font-bold text-gray-900 mt-4">{signature || sender.fullName}</p>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE 2: GOLD MINIMAL (With Outer Border & Inline Header)
  if (template === 'gold_minimal') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg p-10 font-sans border-4 border-[#d4af37] flex flex-col justify-between text-left">
        <div>
          <div className="flex justify-between items-start border-b border-[#d4af37] pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{sender.fullName}</h1>
              <p className="text-sm font-semibold text-[#b89326] mt-0.5">{sender.jobTitle}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                {sender.email && <span>{sender.email}</span>}
                {sender.phone && <span>• {sender.phone}</span>}
                {sender.location && <span>• {sender.location}</span>}
              </div>
            </div>
            {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-[#d4af37]")}
          </div>

          <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
            <div>
              {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
              {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
            </div>
            {recipient.date && <p className="font-semibold text-[#b89326]">{recipient.date}</p>}
          </div>

          <p className="font-bold text-gray-900 mb-4">{salutation}</p>
          {renderLetterBody()}
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700">{signoff}</p>
          <p className="text-base font-bold text-[#b89326] mt-3">{signature || sender.fullName}</p>
        </div>
      </div>
    );
  }

  // TEMPLATE 3: HUNTER GREEN (Sage Sidebar Layout)
  if (template === 'hunter_green') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg flex border border-gray-200 text-left font-sans">
        <div className="w-1/3 bg-[#2b4c3f] p-6 text-white flex flex-col justify-between items-center text-center">
          <div className="w-full">
            {renderPhotoFrame("w-24 h-24", "rounded-full", "border-2 border-emerald-300")}
            <h1 className="text-xl font-bold text-emerald-100 mt-4">{sender.fullName}</h1>
            <p className="text-xs text-emerald-300 uppercase tracking-wider font-semibold mt-1 mb-6">{sender.jobTitle}</p>

            <div className="space-y-3 text-xs text-emerald-100 border-t border-emerald-800 pt-6 text-left">
              {sender.email && <p>✉ {sender.email}</p>}
              {sender.phone && <p>📞 {sender.phone}</p>}
              {sender.location && <p>📍 {sender.location}</p>}
              {sender.linkedin && <p>🔗 {sender.linkedin}</p>}
            </div>
          </div>
        </div>

        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6 text-xs">
              <div>
                {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
                {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
                {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
              </div>
              {recipient.date && <p className="font-semibold text-[#2b4c3f]">{recipient.date}</p>}
            </div>

            <p className="font-bold text-gray-900 mb-4">{salutation}</p>
            {renderLetterBody()}
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700">{signoff}</p>
            <p className="text-base font-bold text-[#2b4c3f] mt-3">{signature || sender.fullName}</p>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE 4: VIOLA PURPLE (Dark Purple Top Header Band)
  if (template === 'viola_purple') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg flex flex-col justify-between font-sans text-left border border-gray-200">
        <div>
          <div className="bg-[#3b1e3e] text-white p-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-purple-100">{sender.fullName}</h1>
              <p className="text-xs font-semibold text-purple-300 mt-1 uppercase tracking-wider">{sender.jobTitle}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-purple-200 mt-3">
                {sender.email && <span>✉ {sender.email}</span>}
                {sender.phone && <span>📞 {sender.phone}</span>}
                {sender.location && <span>📍 {sender.location}</span>}
              </div>
            </div>
            {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-purple-300")}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
              <div>
                {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
                {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
                {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
              </div>
              {recipient.date && <p className="font-semibold text-[#3b1e3e]">{recipient.date}</p>}
            </div>

            <p className="font-bold text-gray-900 mb-4">{salutation}</p>
            {renderLetterBody()}
          </div>
        </div>

        <div className="p-8 pt-0">
          <p className="text-sm font-semibold text-gray-700">{signoff}</p>
          <p className="text-base font-bold text-[#3b1e3e] mt-3">{signature || sender.fullName}</p>
        </div>
      </div>
    );
  }

  // TEMPLATE 7: CORAL PINK ACCENT
  if (template === 'coral_pink') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg p-10 font-sans flex flex-col justify-between text-left border border-rose-100">
        <div>
          <div className="border-b-4 border-rose-500 pb-6 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-rose-600">{sender.fullName}</h1>
              <p className="text-sm font-semibold text-slate-600 mt-1">{sender.jobTitle}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                {sender.email && <span>{sender.email}</span>}
                {sender.phone && <span>• {sender.phone}</span>}
                {sender.location && <span>• {sender.location}</span>}
              </div>
            </div>
            {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-rose-500")}
          </div>

          <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
            <div>
              {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
              {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
            </div>
            {recipient.date && <p className="font-semibold text-rose-600">{recipient.date}</p>}
          </div>

          <p className="font-bold text-gray-900 mb-4">{salutation}</p>
          {renderLetterBody()}
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-gray-700">{signoff}</p>
          <p className="text-base font-bold text-rose-600 mt-3">{signature || sender.fullName}</p>
        </div>
      </div>
    );
  }

  // TEMPLATE 8: TEAL SLATE SPLIT
  if (template === 'teal_slate') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg flex border border-slate-200 text-left font-sans">
        <div className="w-1/3 bg-teal-900 p-6 text-white flex flex-col justify-between items-center text-center">
          <div className="w-full">
            {renderPhotoFrame("w-24 h-24", "rounded-full", "border-2 border-teal-300")}
            <h1 className="text-xl font-bold text-teal-100 mt-4">{sender.fullName}</h1>
            <p className="text-xs text-teal-300 uppercase tracking-wider font-semibold mt-1 mb-6">{sender.jobTitle}</p>
            <div className="space-y-3 text-xs text-teal-100 border-t border-teal-800 pt-6 text-left">
              {sender.email && <p>✉ {sender.email}</p>}
              {sender.phone && <p>📞 {sender.phone}</p>}
              {sender.location && <p>📍 {sender.location}</p>}
            </div>
          </div>
        </div>
        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6 text-xs">
              <div>
                {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
                {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              </div>
              {recipient.date && <p className="font-semibold text-teal-800">{recipient.date}</p>}
            </div>
            <p className="font-bold text-gray-900 mb-4">{salutation}</p>
            {renderLetterBody()}
          </div>
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700">{signoff}</p>
            <p className="text-base font-bold text-teal-800 mt-3">{signature || sender.fullName}</p>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE 9: CORPORATE NAVY
  if (template === 'corporate_navy') {
    return (
      <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg flex flex-col justify-between font-sans text-left border border-slate-200">
        <div>
          <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{sender.fullName}</h1>
              <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">{sender.jobTitle}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-3">
                {sender.email && <span>✉ {sender.email}</span>}
                {sender.phone && <span>📞 {sender.phone}</span>}
              </div>
            </div>
            {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-slate-400")}
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
              <div>
                {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
                {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              </div>
              {recipient.date && <p className="font-semibold text-slate-900">{recipient.date}</p>}
            </div>
            <p className="font-bold text-gray-900 mb-4">{salutation}</p>
            {renderLetterBody()}
          </div>
        </div>
        <div className="p-8 pt-0">
          <p className="text-sm font-semibold text-gray-700">{signoff}</p>
          <p className="text-base font-bold text-slate-900 mt-3">{signature || sender.fullName}</p>
        </div>
      </div>
    );
  }

  // TEMPLATE 5: MODERN BLUE (Default fallback)
  return (
    <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg p-10 font-sans flex flex-col justify-between text-left border border-gray-200">
      <div>
        <div className="border-b-4 border-sky-600 pb-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-sky-700">{sender.fullName}</h1>
            <p className="text-sm font-semibold text-gray-600 mt-1">{sender.jobTitle}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
              {sender.email && <span>{sender.email}</span>}
              {sender.phone && <span>• {sender.phone}</span>}
              {sender.location && <span>• {sender.location}</span>}
            </div>
          </div>
          {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-sky-600")}
        </div>

        <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
          <div>
            {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
            {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
            {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
          </div>
          {recipient.date && <p className="font-semibold text-sky-700">{recipient.date}</p>}
        </div>

        <p className="font-bold text-gray-900 mb-4">{salutation}</p>
        {renderLetterBody()}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-700">{signoff}</p>
        <p className="text-base font-bold text-sky-700 mt-3">{signature || sender.fullName}</p>
      </div>
    </div>
  );
}
