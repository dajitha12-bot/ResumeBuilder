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

  // Section Heading helper
  const renderSectionTitle = (title) => (
    <div className="mb-2">
      <h2 className="font-bold text-sm font-serif border-b-2 pb-0.5 tracking-wide" style={{ color: accentColor, borderColor: accentColor }}>
        {title}
      </h2>
    </div>
  );

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
        
        {/* Header / Personal Information (Matching Screenshot 1) */}
        <div className="mb-5 pb-3 border-b border-slate-200 flex justify-between items-start">
          <div className="space-y-1 max-w-[500px]">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: accentColor }}>
              {personalInfo.fullName || 'Ajitha D R'}
            </h1>
            <p className="text-sm font-semibold italic text-sky-700">
              {personalInfo.subtitle || resume.targetRole || 'B.Tech – Information Technology'}
            </p>

            <div className="space-y-0.5 pt-1 text-[10.5px] text-slate-700">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-sky-600" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-sky-600" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-sky-600" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1.5">
                  <Github className="w-3 h-3 text-sky-600" />
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                    {personalInfo.github}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="w-3 h-3 text-sky-600" />
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                    {personalInfo.linkedin.replace('https://', '')}
                  </a>
                </div>
              )}
              {personalInfo.dob && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-sky-600" />
                  <span>{personalInfo.dob}</span>
                </div>
              )}
            </div>
          </div>

          {/* Top Right Profile Avatar Photo (Matching Screenshot 1) */}
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

        {/* 1. Career Objective / Professional Summary */}
        {summary && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Career Objective')}
            <p className="text-slate-800 text-justify leading-relaxed">{summary}</p>
          </section>
        )}

        {/* 2. Education (Timeline format matching Screenshot 1) */}
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
            <div className="space-y-1 text-[10.5px]">
              {skills.languages?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Languages:</strong> {skills.languages.join(', ')}</div>
              )}
              {skills.frameworks?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Frameworks & Libraries:</strong> {skills.frameworks.join(', ')}</div>
              )}
              {skills.databases?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Databases & Tools:</strong> {skills.databases.concat(skills.tools || []).join(', ')}</div>
              )}
            </div>
          </section>
        )}

        {/* 4. Areas of Interest */}
        {areasOfInterest?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Areas of Interest')}
            <p className="text-slate-800 text-[10.5px]">{areasOfInterest.join(' • ')}</p>
          </section>
        )}

        {/* 5. Key Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '14px' }}>
            {renderSectionTitle('Projects')}
            <div className="space-y-2">
              {projects.map((proj, i) => (
                <div key={proj.id || i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.name}</span>
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
