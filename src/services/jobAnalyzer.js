const TECH_DICTIONARY = [
  'Java', 'Spring Boot', 'Spring', 'REST API', 'RESTful APIs', 'GraphQL',
  'MySQL', 'PostgreSQL', 'SQL', 'MongoDB', 'NoSQL', 'Redis',
  'Python', 'Django', 'Flask', 'FastAPI', 'JavaScript', 'TypeScript',
  'React', 'React.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
  'C', 'C++', 'C#', '.NET', 'HTML', 'CSS', 'Tailwind CSS',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Cloud',
  'Git', 'GitHub', 'CI/CD', 'Jenkins', 'JUnit', 'Testing',
  'Microservices', 'System Design', 'Agile', 'Scrum'
];

export function extractJobRequirements(rawText = '') {
  if (!rawText) {
    return {
      title: 'Software Developer',
      requiredSkills: ['Java', 'Spring Boot', 'REST API', 'MySQL'],
      preferredSkills: ['Docker', 'AWS', 'Git'],
      keywords: ['Backend', 'REST API', 'Database', 'Microservices'],
      experience: '0-2 years',
      education: "Bachelor's degree in Computer Science, IT, or related field"
    };
  }

  const lines = rawText.split('\n');
  const requiredSkills = [];
  const preferredSkills = [];
  const keywords = [];

  TECH_DICTIONARY.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i');
    if (regex.test(rawText)) {
      if (rawText.toLowerCase().includes('preferred') && rawText.toLowerCase().indexOf('preferred') < rawText.toLowerCase().indexOf(tech.toLowerCase())) {
        if (!preferredSkills.includes(tech)) preferredSkills.push(tech);
      } else {
        if (!requiredSkills.includes(tech)) requiredSkills.push(tech);
      }
    }
  });

  const expMatch = rawText.match(/(\d+\s*[-–\to]\s*\d+|\d+\+?)\s*(years|yr|yrs)/i);
  const experience = expMatch ? expMatch[0] : '0-2 years (Fresher eligible)';

  const eduMatch = rawText.match(/(bachelor|master|b\.tech|b\.e|bca|mca|degree)/i);
  const education = eduMatch ? "Bachelor's degree in CS, IT, or relevant technical field" : "Bachelor's degree";

  const domainKeywords = ['Backend', 'Frontend', 'Full Stack', 'REST API', 'Microservices', 'Database', 'Cloud', 'Agile', 'Unit Testing'];
  domainKeywords.forEach(kw => {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(rawText) && !keywords.includes(kw)) {
      keywords.push(kw);
    }
  });

  return {
    title: lines[0]?.replace(/role:|position:|title:/i, '').trim() || 'Software Engineer',
    requiredSkills: requiredSkills.length ? requiredSkills : ['Java', 'Spring Boot', 'REST API', 'SQL'],
    preferredSkills: preferredSkills.length ? preferredSkills : ['Docker', 'AWS', 'Git'],
    keywords: keywords.length ? keywords : ['Backend', 'REST API', 'Database'],
    experience,
    education
  };
}
