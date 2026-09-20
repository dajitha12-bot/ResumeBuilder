import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

export default function ResumePreview({ resume, template = 'modern', zoom = 100, onePage = false }) {
  if (!resume) return <div className="p-8 text-center text-slate-400">No resume data loaded</div>;

  const { personalInfo = {}, summary, education = [], skills = {}, projects = [], experience = [], certifications = [], achievements = [] } = resume;

  // Zoom style calculation
  const zoomScale = zoom / 100;

  // Template Theme Selectors
  const getHeaderStyle = () => {
    switch (template) {
      case 'professional':
        return 'border-b-2 border-slate-800 pb-4 mb-4 text-center';
      case 'minimal':
        return 'pb-3 mb-4 border-b border-slate-200';
      case 'fresher':
        return 'bg-brand-50 p-4 rounded-lg mb-4 border border-brand-100';
      case 'software_developer':
        return 'border-l-4 border-brand-600 pl-4 mb-4';
      case 'academic':
        return 'text-center border-b border-slate-900 pb-3 mb-5 font-serif';
      case 'modern':
      default:
        return 'bg-gradient-to-r from-brand-50 via-slate-50 to-lavender-50 p-5 rounded-xl border border-slate-200 mb-5';
    }
  };

  const getHeadingStyle = () => {
    switch (template) {
      case 'professional':
        return 'font-bold uppercase tracking-wider text-xs border-b border-slate-300 pb-1 mb-2 text-slate-900';
      case 'minimal':
        return 'font-semibold text-xs tracking-wide uppercase text-slate-500 mb-2 border-b border-slate-100 pb-0.5';
      case 'academic':
        return 'font-serif font-bold text-sm tracking-wide text-slate-900 border-b border-slate-800 pb-0.5 mb-2 uppercase';
      case 'software_developer':
        return 'font-bold text-xs uppercase tracking-wider text-brand-600 mb-2 flex items-center gap-1.5';
      case 'modern':
      default:
        return 'font-bold text-xs uppercase tracking-wider text-slate-900 border-b-2 border-brand-500 pb-1 mb-2 inline-block';
    }
  };

  return (
    <div className="w-full overflow-auto flex justify-center py-4 bg-slate-100 min-h-screen">
      <div 
        id="resume-printable-area"
        style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
        className={`bg-white shadow-xl rounded-sm p-8 text-slate-800 transition-all text-xs leading-relaxed ${
          onePage ? 'max-h-[1050px] overflow-hidden' : 'min-h-[1050px]'
        } w-[800px] print:w-full print:shadow-none print:m-0 print:p-6`}
      >
        {/* Header / Personal Information */}
        <div className={getHeaderStyle()}>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{personalInfo.fullName || 'Ajitha D R'}</h1>
          <p className="text-sm font-semibold text-brand-600 mt-0.5">{resume.targetRole || 'Full Stack Developer / Software Engineer'}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600 justify-start items-center">
            {personalInfo.email && (
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personalInfo.location}</span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-slate-400" />{personalInfo.linkedin.replace('https://', '')}</span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1"><Github className="w-3 h-3 text-slate-400" />{personalInfo.github.replace('https://', '')}</span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Professional Summary</h2>
            <p className="text-slate-700 leading-normal text-justify">{summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Technical Skills</h2>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
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

        {/* Projects */}
        {projects?.length > 0 && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Key Projects</h2>
            <div className="space-y-2.5">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="group">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      {proj.name} 
                      {proj.technologies?.length > 0 && (
                        <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {proj.technologies.join(' • ')}
                        </span>
                      )}
                    </span>
                    {proj.role && <span className="text-[11px] text-slate-500 font-normal">{proj.role}</span>}
                  </div>
                  {proj.description && (
                    <p className="text-slate-700 text-[11px] mt-0.5 text-justify leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience / Internship */}
        {experience?.length > 0 && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Work & Internship Experience</h2>
            <div className="space-y-2.5">
              {experience.map((exp, i) => (
                <div key={exp.id || i}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role} — <span className="font-semibold text-brand-600">{exp.organization}</span></span>
                    <span className="text-[11px] text-slate-500 font-normal">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Education</h2>
            <div className="space-y-1.5">
              {education.map((edu, i) => (
                <div key={edu.id || i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-600"> — {edu.institution}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {edu.year} {edu.cgpa ? `| ${edu.cgpa}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <section className="mb-4">
            <h2 className={getHeadingStyle()}>Certifications & Licenses</h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {certifications.map((cert, i) => (
                <div key={cert.id || i} className="flex items-start justify-between bg-slate-50 p-2 rounded border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block font-semibold">{cert.name}</strong>
                    <span className="text-slate-500 text-[10px]">{cert.organization}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <section className="mb-2">
            <h2 className={getHeadingStyle()}>Achievements & Awards</h2>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700">
              {achievements.map((ach, i) => (
                <li key={ach.id || i}>
                  <strong className="text-slate-900 font-semibold">{ach.title}:</strong> {ach.description}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
