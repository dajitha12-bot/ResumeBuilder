import React from 'react';

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
          {sender.avatarUrl ? (
            <img
              src={sender.avatarUrl}
              alt={sender.fullName}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#c7b7a3] text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
              {sender.fullName ? sender.fullName.charAt(0) : 'A'}
            </div>
          )}

          <h1 className="text-xl font-bold text-[#2d2926] tracking-tight">{sender.fullName}</h1>
          <p className="text-xs font-semibold text-[#6e5d4f] mt-1 mb-6 uppercase tracking-wider">{sender.jobTitle}</p>

          <div className="w-full border-t border-[#d4c8b8] pt-6 space-y-3 text-left text-xs text-[#4a4036]">
            {sender.email && (
              <div className="flex items-center space-x-2">
                <span className="font-bold">✉</span>
                <span className="break-all">{sender.email}</span>
              </div>
            )}
            {sender.phone && (
              <div className="flex items-center space-x-2">
                <span className="font-bold">📞</span>
                <span>{sender.phone}</span>
              </div>
            )}
            {sender.location && (
              <div className="flex items-center space-x-2">
                <span className="font-bold">📍</span>
                <span>{sender.location}</span>
              </div>
            )}
            {sender.linkedin && (
              <div className="flex items-center space-x-2">
                <span className="font-bold">🔗</span>
                <span className="break-all">{sender.linkedin}</span>
              </div>
            )}
            {sender.github && (
              <div className="flex items-center space-x-2">
                <span className="font-bold">💻</span>
                <span className="break-all">{sender.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Letter Body) */}
        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            {/* Recipient & Date Header */}
            <div className="mb-6 text-xs text-gray-600 space-y-1">
              {recipient.date && <p className="font-semibold text-gray-500 mb-4">{recipient.date}</p>}
              {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
              {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
              {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
            </div>

            {/* Salutation */}
            <p className="font-bold text-gray-900 mb-4">{salutation}</p>

            {/* Body */}
            {renderLetterBody()}
          </div>

          {/* Closing & Signature */}
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
          {/* Header */}
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
            {sender.avatarUrl && (
              <img src={sender.avatarUrl} alt={sender.fullName} className="w-20 h-20 rounded-full border-2 border-[#d4af37] object-cover" />
            )}
          </div>

          {/* Date & Recipient */}
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
        {/* Left Green Sidebar */}
        <div className="w-1/3 bg-[#2b4c3f] p-6 text-white flex flex-col justify-between">
          <div>
            {sender.avatarUrl && (
              <img src={sender.avatarUrl} alt={sender.fullName} className="w-24 h-24 rounded-full border-2 border-emerald-300 mx-auto object-cover mb-4 shadow" />
            )}
            <h1 className="text-xl font-bold text-emerald-100 text-center">{sender.fullName}</h1>
            <p className="text-xs text-emerald-300 text-center uppercase tracking-wider font-semibold mt-1 mb-6">{sender.jobTitle}</p>

            <div className="space-y-3 text-xs text-emerald-100 border-t border-emerald-800 pt-6">
              {sender.email && <p>✉ {sender.email}</p>}
              {sender.phone && <p>📞 {sender.phone}</p>}
              {sender.location && <p>📍 {sender.location}</p>}
              {sender.linkedin && <p>🔗 {sender.linkedin}</p>}
            </div>
          </div>
        </div>

        {/* Right Main Content */}
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
          {/* Top Header Band */}
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
            {sender.avatarUrl && (
              <img src={sender.avatarUrl} alt={sender.fullName} className="w-20 h-20 rounded-full border-2 border-purple-300 object-cover shadow" />
            )}
          </div>

          {/* Letter Body */}
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

  // TEMPLATE 5: MODERN BLUE
  if (template === 'modern_blue') {
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
            {sender.avatarUrl && (
              <img src={sender.avatarUrl} alt={sender.fullName} className="w-20 h-20 rounded-full border-2 border-sky-600 object-cover" />
            )}
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

  // TEMPLATE 6: EXECUTIVE CLASSIC (Default Fallback)
  return (
    <div id="cover-letter-preview" className="bg-white text-gray-800 w-full max-w-[800px] min-h-[1050px] shadow-lg p-10 font-serif flex flex-col justify-between text-left border border-gray-200">
      <div>
        <div className="text-center border-b border-gray-300 pb-6 mb-6">
          <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900">{sender.fullName}</h1>
          <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-widest">{sender.jobTitle}</p>
          <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-3">
            {sender.email && <span>{sender.email}</span>}
            {sender.phone && <span>• {sender.phone}</span>}
            {sender.location && <span>• {sender.location}</span>}
          </div>
        </div>

        <div className="flex justify-between items-start mb-6 text-xs text-gray-600">
          <div>
            {recipient.hiringManager && <p className="font-bold text-gray-900">{recipient.hiringManager}</p>}
            {recipient.company && <p className="font-semibold text-gray-700">{recipient.company}</p>}
            {recipient.address && <p className="whitespace-pre-line text-gray-500">{recipient.address}</p>}
          </div>
          {recipient.date && <p className="font-semibold text-gray-500">{recipient.date}</p>}
        </div>

        <p className="font-bold text-gray-900 mb-4">{salutation}</p>
        {renderLetterBody('text-gray-800')}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-700">{signoff}</p>
        <p className="text-base font-bold text-gray-900 mt-3">{signature || sender.fullName}</p>
      </div>
    </div>
  );
}
