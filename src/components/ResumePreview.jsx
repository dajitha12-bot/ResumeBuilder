import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from 'lucide-react';

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
    accentColor: '#0284c7', // Sky blue matching screenshot 1
    onePage: true
  };

  const currentTemplate = resume.template || template || 'classic_serif';
  const zoomScale = zoom / 100;
  const accentColor = options.accentColor || '#0284c7';

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
    return (
      <div className="mb-2">
        <h2 className="font-bold text-sm border-b-2 pb-0.5 tracking-wide" style={{ color: accentColor, borderColor: accentColor, fontFamily: currentTemplate === 'classic_serif' ? 'Georgia, serif' : 'inherit' }}>
          {title}
        </h2>
      </div>
    );
  };

  // Check if Two-Column template layout
  if (currentTemplate === 'two_column') {
    return (
      <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/80 min-h-screen">
        <div 
          id="resume-printable-area"
          style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center', padding: options.margins || '0.4in' }}
          className="bg-white shadow-2xl rounded-sm text-slate-800 w-[794px] min-h-[1123px] grid grid-cols-12 text-[10.5px] leading-relaxed"
        >
          {/* Left Column (4 cols) */}
          <div className="col-span-4 bg-slate-50 p-5 border-r border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-300 mx-auto bg-slate-200">
                <img src={personalInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Ajitha"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">{personalInfo.fullName || 'Ajitha D R'}</h1>
              <p className="text-xs italic font-medium text-sky-700">{personalInfo.subtitle || resume.targetRole}</p>
            </div>

            {/* Contact */}
            <div className="space-y-1 pt-2 border-t border-slate-200 text-[10px]">
              <strong className="text-slate-900 font-bold block uppercase tracking-wider mb-1">Contact</strong>
              {personalInfo.email && <div className="truncate">{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.github && <div className="truncate text-sky-700">{personalInfo.github}</div>}
              {personalInfo.linkedin && <div className="truncate text-sky-700">{personalInfo.linkedin.replace('https://', '')}</div>}
            </div>

            {/* Skills */}
            {skills && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <strong className="text-slate-900 font-bold block uppercase tracking-wider mb-1">Skills</strong>
                {skills.languages?.length > 0 && <div><strong className="block text-[10px]">Languages:</strong> {skills.languages.join(', ')}</div>}
                {skills.frameworks?.length > 0 && <div><strong className="block text-[10px]">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
              </div>
            )}
          </div>

          {/* Right Main Column (8 cols) */}
          <div className="col-span-8 p-6 space-y-4">
            {summary && (
              <div>
                {renderSectionTitle('Career Objective')}
                <p className="text-slate-700">{summary}</p>
              </div>
            )}

            {education?.length > 0 && (
              <div>
                {renderSectionTitle('Education')}
                <div className="space-y-2">
                  {education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <strong className="font-bold text-slate-900 block">{edu.degree}</strong>
                        <span className="text-slate-600">{edu.institution}</span>
                      </div>
                      <span className="text-sky-700 font-medium italic">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects?.length > 0 && (
              <div>
                {renderSectionTitle('Projects')}
                <div className="space-y-2">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <span className="font-bold text-slate-900 block">{proj.name}</span>
                      <p className="text-slate-700 text-[10px]">{proj.description}</p>
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

  // Single-Column Layouts (Classic Serif, Modern, Minimal, Executive, Fresher, Tech Lead, Creative)
  return (
    <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/80 min-h-screen">
      <div 
        id="resume-printable-area"
        style={{ 
          transform: `scale(${zoomScale})`, 
          transformOrigin: 'top center',
          fontFamily: currentTemplate === 'classic_serif' || currentTemplate === 'academic' ? 'Georgia, Cambria, "Times New Roman", serif' : (options.fontFamily || 'Inter'),
          fontSize: options.fontSize || '11px',
          lineHeight: options.lineSpacing || '1.4',
          padding: options.margins || '0.45in'
        }}
        className={`bg-white shadow-2xl rounded-sm text-slate-800 transition-all ${
          onePage || options.onePage ? 'max-h-[1123px] overflow-hidden' : 'min-h-[1123px]'
        } w-[794px] print:w-full print:shadow-none print:m-0 print:p-6 relative`}
      >
        
        {/* Header / Personal Information */}
        <div className={`mb-5 pb-3 border-b border-slate-200 flex justify-between items-start ${
          currentTemplate === 'executive' ? 'bg-slate-900 text-white p-5 rounded-t-xl border-none -mx-6 -mt-6 mb-5' : ''
        }`}>
          <div className="space-y-1 max-w-[500px]">
            <h1 className="text-2xl font-bold tracking-tight" style={currentTemplate === 'executive' ? { color: '#ffffff' } : { color: accentColor }}>
              {personalInfo.fullName || 'Ajitha D R'}
            </h1>
            <p className={`text-sm font-semibold italic ${currentTemplate === 'executive' ? 'text-sky-300' : 'text-sky-700'}`}>
              {personalInfo.subtitle || resume.targetRole || 'B.Tech – Information Technology'}
            </p>

            <div className={`space-y-0.5 pt-1 text-[10.5px] ${currentTemplate === 'executive' ? 'text-slate-300' : 'text-slate-700'}`}>
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-sky-500" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-sky-500" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-sky-500" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1.5">
                  <Github className="w-3 h-3 text-sky-500" />
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className={currentTemplate === 'executive' ? 'text-sky-300 hover:underline' : 'text-sky-700 hover:underline'}>
                    {personalInfo.github}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="w-3 h-3 text-sky-500" />
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className={currentTemplate === 'executive' ? 'text-sky-300 hover:underline' : 'text-sky-700 hover:underline'}>
                    {personalInfo.linkedin.replace('https://', '')}
                  </a>
                </div>
              )}
              {personalInfo.dob && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-sky-500" />
                  <span>{personalInfo.dob}</span>
                </div>
              )}
            </div>
          </div>

          {/* Top Right Profile Avatar Photo */}
          <div className="flex-shrink-0 pt-1">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 flex items-center justify-center">
              {personalInfo.avatar ? (
                <img 
                  src={personalInfo.avatar} 
                  alt="Ajitha D R" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Ajitha";
                  }}
                />
              ) : (
                <span className="font-bold text-slate-400 text-xl">AD</span>
              )}
            </div>
          </div>
        </div>

        {/* 1. Career Objective / Summary */}
        {summary && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Career Objective')}
            <p className="text-slate-800 text-justify leading-relaxed">{summary}</p>
          </section>
        )}

        {/* 2. Education (Timeline format) */}
        {education?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Education')}
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={edu.id || i} className="grid grid-cols-12 gap-2 text-[10.5px]">
                  <div className="col-span-3 text-sky-700 italic font-medium">
                    {edu.year}
                  </div>
                  <div className="col-span-9 space-y-0.5">
                    <div>
                      <strong className="text-slate-900 font-bold">{edu.degree}</strong>
                      <span className="text-slate-700">, {edu.institution}</span>
                    </div>
                    {edu.cgpa && (
                      <div className="text-slate-600 text-[10px] font-medium">{edu.cgpa}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Technical Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Technical Skills')}
            <div className="space-y-1.5 text-[10.5px]">
              {skills.languages?.length > 0 && (
                <div>
                  <strong className="text-slate-900 font-semibold block mb-0.5">Languages:</strong>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.frameworks?.length > 0 && (
                <div className="pt-1">
                  <strong className="text-slate-900 font-semibold block mb-0.5">Frameworks & Libraries:</strong>
                  <div className="flex flex-wrap gap-1">
                    {skills.frameworks.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.databases?.length > 0 && (
                <div className="pt-1">
                  <strong className="text-slate-900 font-semibold block mb-0.5">Databases & Tools:</strong>
                  <div className="flex flex-wrap gap-1">
                    {skills.databases.concat(skills.tools || []).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Areas of Interest */}
        {areasOfInterest?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Areas of Interest')}
            <div className="flex flex-wrap gap-1.5 text-[10.5px]">
              {areasOfInterest.map((interest, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-md font-semibold border border-slate-200">
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 5. Key Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Projects')}
            <div className="space-y-2.5">
              {projects.map((proj, i) => (
                <div key={proj.id || i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[11px]">{proj.name}</span>
                    {proj.technologies?.length > 0 && (
                      <span className="text-[9.5px] text-sky-700 font-medium italic">
                        {proj.technologies.join(' • ')}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-slate-700 text-[10.5px] mt-0.5 text-justify leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Experience')}
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={exp.id || i}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role} — <span style={{ color: accentColor }}>{exp.organization}</span></span>
                    <span className="text-[10px] text-slate-500 font-normal">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 text-[10.5px] mt-0.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Certifications */}
        {certifications?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Certifications')}
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {certifications.map((cert, i) => (
                <div key={cert.id || i} className="flex justify-between border-b border-slate-100 pb-1">
                  <div>
                    <strong className="text-slate-900 block font-semibold">{cert.name}</strong>
                    <span className="text-slate-500 text-[9.5px]">{cert.organization}</span>
                  </div>
                  <span className="text-sky-700 text-[9.5px] italic">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Achievements */}
        {achievements?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Achievements')}
            <ul className="list-disc list-inside text-[10.5px] space-y-0.5 text-slate-700">
              {achievements.map((ach, i) => (
                <li key={ach.id || i}>
                  <strong className="text-slate-900">{ach.title}:</strong> {ach.description}
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}
