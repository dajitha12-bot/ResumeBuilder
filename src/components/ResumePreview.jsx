import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Camera } from 'lucide-react';

export default function ResumePreview({ resume, template = 'classic_serif', zoom = 100, onePage = true, customizeOptions }) {
  if (!resume) return <div className="p-8 text-center text-slate-400">No resume data loaded</div>;

  const {
    personalInfo = {},
    summary,
    education = [],
    skills = {},
    areasOfInterest = [],
    projects = [],
    experience = [],
    certifications = [],
    achievements = [],
    positions = [],
    languages = [],
    links = []
  } = resume;

  const options = customizeOptions || {
    fontFamily: 'Georgia, Cambria, serif',
    fontSize: '11px',
    headingStyle: 'underlined',
    lineSpacing: '1.4',
    sectionSpacing: '14px',
    margins: '0.45in',
    accentColor: '#0284c7', // Sky blue matching FlowCV design
    onePage: true
  };

  const currentTemplate = resume.template || template || 'classic_serif';
  const zoomScale = zoom / 100;
  const accentColor = options.accentColor || '#0284c7';

  // Photo Frame Renderer: Blank dashed upload box if no photo is set
  const renderPhotoFrame = (sizeClass = "w-20 h-20", roundedClass = "rounded-full") => {
    const photoUrl = personalInfo.avatarUrl || personalInfo.avatar;
    if (photoUrl) {
      return (
        <div className={`${sizeClass} ${roundedClass} overflow-hidden border-2 border-slate-300 shadow-sm shrink-0`}>
          <img src={photoUrl} alt={personalInfo.fullName || "Profile"} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={`${sizeClass} ${roundedClass} border-2 border-dashed border-sky-400 bg-sky-50/80 flex flex-col items-center justify-center text-sky-600 hover:bg-sky-100/80 transition cursor-pointer shrink-0 shadow-sm`}>
        <Camera className="w-4 h-4 mb-0.5 text-sky-600" />
        <span className="text-[9px] font-bold tracking-tight">Add Photo</span>
      </div>
    );
  };

  // Section Heading Helper
  const renderSectionTitle = (title) => {
    if (currentTemplate === 'minimal') {
      return (
        <div className="mb-2">
          <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            {title}
          </h2>
        </div>
      );
    }
    if (currentTemplate === 'emerald_corporate') {
      return (
        <div className="mb-2">
          <h2 className="font-bold text-sm border-b-2 border-emerald-600 text-emerald-800 pb-0.5 tracking-wide">
            {title}
          </h2>
        </div>
      );
    }
    if (currentTemplate === 'coral_modern') {
      return (
        <div className="mb-2">
          <h2 className="font-bold text-sm border-b-2 border-rose-500 text-rose-700 pb-0.5 tracking-wide">
            {title}
          </h2>
        </div>
      );
    }
    return (
      <div className="mb-2">
        <h2 className="font-bold text-sm border-b-2 pb-0.5 tracking-wide" style={{ color: accentColor, borderColor: accentColor, fontFamily: currentTemplate === 'classic_serif' ? 'Georgia, serif' : 'inherit' }}>
          {title}
        </h2>
      </div>
    );
  };

  // TEMPLATES: SIDEBAR LAYOUTS (Sage Green, Hunter Green, Lara Müller, Two-Column, Coral Modern)
  if (['two_column', 'coral_modern', 'sage_green', 'hunter_green', 'lara_miller'].includes(currentTemplate)) {
    const isCoral = currentTemplate === 'coral_modern';
    const isSage = currentTemplate === 'sage_green';
    const isHunter = currentTemplate === 'hunter_green';
    const isLara = currentTemplate === 'lara_miller';

    let sidebarBg = 'bg-slate-50 border-slate-200 text-slate-800';
    let textColor = 'text-sky-700';

    if (isCoral) { sidebarBg = 'bg-rose-50/50 border-rose-200 text-rose-900'; textColor = 'text-rose-600'; }
    if (isSage) { sidebarBg = 'bg-[#e5ebe7] border-[#c3d1c8] text-[#1c3328]'; textColor = 'text-[#2e5241]'; }
    if (isHunter) { sidebarBg = 'bg-[#1c3328] border-[#2b4c3f] text-white'; textColor = 'text-emerald-300'; }
    if (isLara) { sidebarBg = 'bg-[#7a456c] border-[#8a527c] text-white'; textColor = 'text-purple-200'; }

    return (
      <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/80 min-h-screen">
        <div 
          id="resume-printable-area"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', padding: options.margins || '0.4in' }}
          className="bg-white shadow-2xl rounded-sm text-slate-800 w-[794px] min-h-[1123px] grid grid-cols-12 text-[10.5px] leading-relaxed text-left"
        >
          {/* Left Column (4 cols) */}
          <div className={`col-span-4 p-5 border-r space-y-4 ${sidebarBg}`}>
            <div className="flex flex-col items-center text-center space-y-2">
              {renderPhotoFrame("w-24 h-24", "rounded-full")}
              <h1 className={`font-bold text-base leading-tight ${isHunter || isLara ? 'text-white' : 'text-slate-900'}`}>{personalInfo.fullName || 'Ajitha D R'}</h1>
              <p className={`text-xs italic font-medium ${textColor}`}>
                {personalInfo.subtitle || resume.targetRole}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200 text-[10px]">
              <strong className="text-slate-900 font-bold block uppercase tracking-wider mb-1">Contact Details</strong>
              {personalInfo.email && <div className="truncate">✉ {personalInfo.email}</div>}
              {personalInfo.phone && <div>📞 {personalInfo.phone}</div>}
              {personalInfo.location && <div>📍 {personalInfo.location}</div>}
              {personalInfo.github && <div className="truncate font-semibold text-sky-700">💻 {personalInfo.github}</div>}
              {personalInfo.linkedin && <div className="truncate font-semibold text-sky-700">🔗 {personalInfo.linkedin.replace('https://', '')}</div>}
            </div>

            {/* Skills */}
            {skills && (
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <strong className="text-slate-900 font-bold block uppercase tracking-wider">Technical Skills</strong>
                {skills.languages?.length > 0 && <div><strong className="block text-[10px] text-slate-700">Languages:</strong> {skills.languages.join(', ')}</div>}
                {skills.frameworks?.length > 0 && <div><strong className="block text-[10px] text-slate-700">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
                {skills.developerTools?.length > 0 && <div><strong className="block text-[10px] text-slate-700">Developer Tools:</strong> {skills.developerTools.join(', ')}</div>}
              </div>
            )}
          </div>

          {/* Right Main Column (8 cols) */}
          <div className="col-span-8 p-6 space-y-4">
            {summary && (
              <div>
                {renderSectionTitle('Career Objective')}
                <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
              </div>
            )}

            {/* Education Timeline */}
            {education.length > 0 && (
              <div>
                {renderSectionTitle('Education')}
                <div className="space-y-2.5">
                  {education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-[11px]">{edu.degree}</h3>
                        <p className="text-slate-600 italic text-[10px]">{edu.institution}</p>
                        {edu.details && <p className="text-slate-500 text-[9.5px] mt-0.5">{edu.details}</p>}
                      </div>
                      <span className="text-[9.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {edu.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                {renderSectionTitle('Projects')}
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 text-[11px]">{proj.name}</h3>
                        {proj.duration && <span className="text-[9.5px] font-semibold text-slate-500">{proj.duration}</span>}
                      </div>
                      <p className="text-slate-600 text-[10px] mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATES: BANNER HEADER LAYOUTS (Atlantic Standard, Atlantic Crest, Cobalt Edge, Slate Focus, Confident Grid, Quicksilver)
  if (['atlantic_standard', 'atlantic_crest', 'cobalt_edge', 'slate_focus', 'confident_grid', 'quicksilver'].includes(currentTemplate)) {
    const isAtlantic = currentTemplate === 'atlantic_standard';
    const isCrest = currentTemplate === 'atlantic_crest';
    const isCobalt = currentTemplate === 'cobalt_edge';

    let bannerBg = 'bg-[#1e293b] text-white';
    if (isCrest) bannerBg = 'bg-[#003366] text-white';
    if (isCobalt) bannerBg = 'bg-[#1e40af] text-white';
    if (currentTemplate === 'slate_focus') bannerBg = 'bg-[#334155] text-white';
    if (currentTemplate === 'confident_grid' || currentTemplate === 'quicksilver') bannerBg = 'bg-slate-100 text-slate-900 border-b border-slate-300';

    return (
      <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/80 min-h-screen">
        <div 
          id="resume-printable-area"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', padding: options.margins || '0.4in' }}
          className="bg-white shadow-2xl rounded-sm text-slate-800 w-[794px] min-h-[1123px] text-[10.5px] leading-relaxed text-left flex flex-col justify-between"
        >
          <div>
            {/* Top Banner */}
            <div className={`${bannerBg} p-8 flex justify-between items-center mb-6`}>
              <div>
                <h1 className={`text-2xl font-extrabold tracking-tight ${bannerBg.includes('text-white') ? 'text-white' : 'text-slate-900'}`}>{personalInfo.fullName || 'Ajitha D R'}</h1>
                <p className={`text-xs font-semibold uppercase tracking-widest mt-1 ${bannerBg.includes('text-white') ? 'text-sky-200' : 'text-sky-700'}`}>{personalInfo.subtitle || resume.targetRole}</p>
                <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[10px] mt-3 ${bannerBg.includes('text-white') ? 'text-slate-300' : 'text-slate-600'}`}>
                  {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                  {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                  {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
              </div>
              {renderPhotoFrame("w-20 h-20", "rounded-full", "border-2 border-white/80")}
            </div>

            <div className="px-8 space-y-5">
              {summary && (
                <div>
                  {renderSectionTitle('Summary')}
                  <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  {renderSectionTitle('Education')}
                  <div className="space-y-2">
                    {education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 text-[11px]">{edu.degree}</h3>
                          <p className="text-slate-600 italic text-[10px]">{edu.institution}</p>
                        </div>
                        <span className="text-[9.5px] font-semibold text-slate-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && (
                <div>
                  {renderSectionTitle('Technical Skills')}
                  <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                    {skills.languages?.length > 0 && <div><strong className="block text-slate-900 font-bold">Programming Languages:</strong> {skills.languages.join(', ')}</div>}
                    {skills.frameworks?.length > 0 && <div><strong className="block text-slate-900 font-bold">Frameworks & Tools:</strong> {skills.frameworks.join(', ')}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT MAIN LAYOUT (Classic Serif, Modern, Minimal, Executive, Fresher, Developer, Creative, Emerald)
  return (
    <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/80 min-h-screen">
      <div 
        id="resume-printable-area"
        style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', padding: options.margins || '0.45in' }}
        className="bg-white shadow-2xl rounded-sm text-slate-800 w-[794px] min-h-[1123px] flex flex-col justify-between text-[11px] leading-relaxed text-left font-sans"
      >
        <div className="space-y-4">
          
          {/* Top Header Row with Name & Photo Upload Frame */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personalInfo.fullName || 'Ajitha D R'}</h1>
              <p className="text-xs italic font-semibold text-sky-700 mt-0.5">{personalInfo.subtitle || 'B.Tech – Information Technology'}</p>
              
              {/* Contact Items Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 mt-2">
                {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                {personalInfo.dob && <span>🎂 DOB: {personalInfo.dob}</span>}
              </div>
              
              <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-sky-700 mt-1 font-medium">
                {personalInfo.github && <span>💻 {personalInfo.github}</span>}
                {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
              </div>
            </div>

            {/* Photo Frame Container */}
            {renderPhotoFrame("w-20 h-20", "rounded-full")}
          </div>

          {/* Career Objective */}
          {summary && (
            <div>
              {renderSectionTitle('Career Objective')}
              <p className="text-slate-700 text-[10.5px] leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* Education Timeline */}
          {education.length > 0 && (
            <div>
              {renderSectionTitle('Education')}
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-[11px]">{edu.degree}</h3>
                      <p className="text-slate-600 italic text-[10px]">{edu.institution}</p>
                      {edu.details && <p className="text-slate-500 text-[9.5px] mt-0.5">{edu.details}</p>}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {skills && (
            <div>
              {renderSectionTitle('Technical Skills')}
              <div className="space-y-1 text-[10.5px]">
                {skills.languages?.length > 0 && (
                  <div><strong className="text-slate-900">Languages:</strong> {skills.languages.join(', ')}</div>
                )}
                {skills.frameworks?.length > 0 && (
                  <div><strong className="text-slate-900">Frameworks / Libraries:</strong> {skills.frameworks.join(', ')}</div>
                )}
                {skills.webTechnologies?.length > 0 && (
                  <div><strong className="text-slate-900">Web Technologies:</strong> {skills.webTechnologies.join(', ')}</div>
                )}
                {skills.developerTools?.length > 0 && (
                  <div><strong className="text-slate-900">Developer Tools:</strong> {skills.developerTools.join(', ')}</div>
                )}
              </div>
            </div>
          )}

          {/* Key Projects */}
          {projects.length > 0 && (
            <div>
              {renderSectionTitle('Key Projects')}
              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-[11px]">{proj.name}</h3>
                      {proj.duration && <span className="text-[9.5px] font-medium text-slate-500">{proj.duration}</span>}
                    </div>
                    {proj.description && <p className="text-slate-700 text-[10px]">{proj.description}</p>}
                    {proj.bullets?.length > 0 && (
                      <ul className="list-disc list-inside text-slate-600 text-[9.5px] space-y-0.5 ml-1">
                        {proj.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience / Internships */}
          {experience.length > 0 && (
            <div>
              {renderSectionTitle('Internships & Experience')}
              <div className="space-y-2">
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-[11px]">{exp.role}</h3>
                      <span className="text-[9.5px] text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-slate-600 italic text-[10px]">{exp.organization}</p>
                    {exp.description && <p className="text-slate-600 text-[9.5px] mt-0.5">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              {renderSectionTitle('Certifications')}
              <div className="space-y-1 text-[10px]">
                {certifications.map((c, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-semibold text-slate-800">• {c.title} {c.issuer ? `— ${c.issuer}` : ''}</span>
                    <span className="text-slate-500">{c.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements & Awards */}
          {achievements.length > 0 && (
            <div>
              {renderSectionTitle('Achievements & Awards')}
              <div className="space-y-1 text-[10px]">
                {achievements.map((a, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-semibold text-slate-800">• {a.title} {a.organization ? `(${a.organization})` : ''}</span>
                    <span className="text-slate-500">{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Areas of Interest */}
          {(Array.isArray(interests) ? interests.length > 0 : Boolean(interests)) && (
            <div>
              {renderSectionTitle('Areas of Interest')}
              <p className="text-slate-700 text-[10px]">
                {Array.isArray(interests) ? interests.join(', ') : interests}
              </p>
            </div>
          )}

          {/* Positions of Responsibility */}
          {positions.length > 0 && (
            <div>
              {renderSectionTitle('Positions of Responsibility')}
              <div className="space-y-1.5 text-[10px]">
                {positions.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{p.role}</span>
                      {p.organization && <span className="text-slate-600 italic"> — {p.organization}</span>}
                    </div>
                    <span className="text-slate-500 text-[9.5px]">{p.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Known */}
          {(Array.isArray(languages) ? languages.length > 0 : Boolean(languages)) && (
            <div>
              {renderSectionTitle('Languages Known')}
              <p className="text-slate-700 text-[10px]">
                {Array.isArray(languages) ? languages.join(', ') : languages}
              </p>
            </div>
          )}

          {/* Links & Profiles */}
          {links.length > 0 && (
            <div>
              {renderSectionTitle('Profiles & Links')}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                {links.map((l, idx) => (
                  <div key={idx} className="font-medium text-sky-700">
                    🔗 <strong>{l.platform}:</strong> {l.url}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info line */}
        <div className="pt-4 border-t border-slate-100 text-[9px] text-slate-400 flex justify-between">
          <span>{personalInfo.fullName || 'Ajitha D R'} — Resume</span>
          <span>FlowCV Template Engine</span>
        </div>
      </div>
    </div>
  );
}
