import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

export default function ResumePreview({ resume, template = 'modern', zoom = 100, onePage = true, customizeOptions }) {
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
    fontFamily: 'Inter',
    fontSize: '11px',
    headingStyle: 'solid_bar',
    lineSpacing: '1.4',
    sectionSpacing: '12px',
    margins: '0.4in',
    accentColor: '#3b82f6',
    onePage: true
  };

  const currentTemplate = resume.template || template || 'modern';
  const zoomScale = zoom / 100;
  const accentColor = options.accentColor || '#3b82f6';

  // Heading style generator
  const renderHeading = (title) => {
    switch (options.headingStyle) {
      case 'underlined':
        return (
          <h2 className="font-bold text-xs uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: accentColor, color: accentColor }}>
            {title}
          </h2>
        );
      case 'left_border':
        return (
          <h2 className="font-bold text-xs uppercase tracking-wider pl-2.5 border-l-4 mb-2 text-slate-900" style={{ borderColor: accentColor }}>
            {title}
          </h2>
        );
      case 'bold_uppercase':
        return (
          <h2 className="font-extrabold text-xs uppercase tracking-wider mb-1.5 text-slate-900">
            {title}
          </h2>
        );
      case 'serif_classic':
        return (
          <h2 className="font-serif font-bold text-xs tracking-wide border-b pb-0.5 mb-2 uppercase text-slate-900 border-slate-800">
            {title}
          </h2>
        );
      case 'solid_bar':
      default:
        return (
          <div className="mb-2">
            <h2 className="font-bold text-xs uppercase tracking-wider inline-block text-slate-900 border-b-2 pb-0.5" style={{ borderColor: accentColor }}>
              {title}
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="w-full overflow-auto flex justify-center py-4 bg-slate-200/70 min-h-screen">
      <div 
        id="resume-printable-area"
        style={{ 
          transform: `scale(${zoomScale})`, 
          transformOrigin: 'top center',
          fontFamily: options.fontFamily || 'Inter',
          fontSize: options.fontSize || '11px',
          lineHeight: options.lineSpacing || '1.4',
          padding: options.margins || '0.4in'
        }}
        className={`bg-white shadow-2xl rounded-sm text-slate-800 transition-all ${
          onePage || options.onePage ? 'max-h-[1123px] overflow-hidden' : 'min-h-[1123px]'
        } w-[794px] print:w-full print:shadow-none print:m-0 print:p-6`}
      >
        
        {/* Header / Personal Information */}
        <div className={`mb-4 pb-3 ${
          currentTemplate === 'fresher' ? 'bg-brand-50 p-4 rounded-xl border border-brand-100' :
          currentTemplate === 'professional' ? 'border-b-2 border-slate-900 pb-3 text-center' :
          currentTemplate === 'executive' ? 'border-l-4 pl-4 bg-slate-50 p-4 rounded-r-xl' :
          currentTemplate === 'creative' ? 'bg-gradient-to-r from-brand-50 to-lavender-50 p-4 rounded-2xl border border-brand-100' :
          currentTemplate === 'academic' ? 'text-center border-b border-slate-800 pb-3 font-serif' :
          'border-b border-slate-200 pb-3'
        }`} style={currentTemplate === 'executive' ? { borderColor: accentColor } : {}}>
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personalInfo.fullName || 'Ajitha D R'}</h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: accentColor }}>
            {resume.targetRole || 'B.Tech Information Technology Student'}
          </p>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10.5px] text-slate-600 items-center">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-slate-400" />{personalInfo.linkedin.replace('https://', '')}</span>}
            {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-slate-400" />{personalInfo.github.replace('https://', '')}</span>}
            {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" />{personalInfo.portfolio.replace('https://', '')}</span>}
          </div>
        </div>

        {/* 1. Professional Summary / Objective */}
        {summary && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Professional Summary')}
            <p className="text-slate-700 text-justify leading-relaxed">{summary}</p>
          </section>
        )}

        {/* 2. Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Education')}
            <div className="space-y-1.5">
              {education.map((edu, i) => (
                <div key={edu.id || i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-600"> — {edu.institution}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 font-semibold">
                    {edu.year} {edu.cgpa ? `| ${edu.cgpa}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Technical Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Technical Skills')}
            <div className="space-y-1 text-[10.5px]">
              {skills.languages?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Languages:</strong> {skills.languages.join(', ')}</div>
              )}
              {skills.frameworks?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Frameworks & Libraries:</strong> {skills.frameworks.join(', ')}</div>
              )}
              {skills.databases?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Databases & Cloud:</strong> {skills.databases.join(', ')}</div>
              )}
              {skills.tools?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Tools & Platforms:</strong> {skills.tools.join(', ')}</div>
              )}
              {skills.softSkills?.length > 0 && (
                <div><strong className="text-slate-900 font-semibold">Soft Skills:</strong> {skills.softSkills.join(', ')}</div>
              )}
            </div>
          </section>
        )}

        {/* 4. Key Projects */}
        {projects?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Key Projects')}
            <div className="space-y-2">
              {projects.map((proj, i) => (
                <div key={proj.id || i}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">
                      {proj.name}
                      {proj.technologies?.length > 0 && (
                        <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-2">
                          {proj.technologies.join(' • ')}
                        </span>
                      )}
                    </span>
                    {proj.role && <span className="text-[10.5px] text-slate-500">{proj.role}</span>}
                  </div>
                  {proj.description && (
                    <p className="text-slate-700 text-[10.5px] mt-0.5 text-justify leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Internships / Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Work & Internship Experience')}
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={exp.id || i}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role} — <span style={{ color: accentColor }}>{exp.organization}</span></span>
                    <span className="text-[10.5px] text-slate-500 font-normal">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 text-[10.5px] mt-0.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Certifications */}
        {certifications?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Certifications & Online Courses')}
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {certifications.map((cert, i) => (
                <div key={cert.id || i} className="bg-slate-50 p-1.5 rounded border border-slate-100 flex justify-between">
                  <div>
                    <strong className="text-slate-900 block">{cert.name}</strong>
                    <span className="text-slate-500 text-[9.5px]">{cert.organization}</span>
                  </div>
                  <span className="text-slate-400 text-[9.5px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Achievements */}
        {achievements?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Achievements & Awards')}
            <ul className="list-disc list-inside text-[10.5px] space-y-0.5 text-slate-700">
              {achievements.map((ach, i) => (
                <li key={ach.id || i}>
                  <strong className="text-slate-900">{ach.title}:</strong> {ach.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8. Areas of Interest */}
        {areasOfInterest?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Areas of Interest')}
            <div className="flex flex-wrap gap-1.5 text-[10.5px]">
              {areasOfInterest.map((interest, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 9. Positions & Activities */}
        {positions?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Positions & Responsibilities')}
            <div className="space-y-1.5 text-[10.5px]">
              {positions.map((pos, i) => (
                <div key={i}>
                  <strong className="text-slate-900">{pos.role}</strong> — <span className="text-slate-600">{pos.organization}</span>
                  <p className="text-slate-600 text-[10px]">{pos.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. Languages */}
        {languages?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Languages Known')}
            <p className="text-slate-700 text-[10.5px]">{languages.join(' • ')}</p>
          </section>
        )}

        {/* 11. Links */}
        {links?.length > 0 && (
          <section style={{ marginBottom: options.sectionSpacing || '12px' }}>
            {renderHeading('Links & Profiles')}
            <div className="flex flex-wrap gap-3 text-[10.5px] text-brand-600">
              {links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  <span>{link.label || link.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
