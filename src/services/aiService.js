// Check if OpenAI API Key is configured in Vite env
const getApiKey = () => {
  try {
    return import.meta.env?.VITE_OPENAI_API_KEY || '';
  } catch (e) {
    return '';
  }
};

const hasOpenAI = () => Boolean(getApiKey() && getApiKey().trim().startsWith('sk-'));

// Fallback Mock AI Engine
export class MockAIEngine {
  static generateSummary(data) {
    const role = data.targetRole || 'Software Engineer';
    const skillsList = Array.isArray(data.skills) ? data.skills.slice(0, 4).join(', ') : (data.skills || 'Java, Spring Boot, SQL');
    const degree = data.education?.[0]?.degree || 'Information Technology degree';
    
    return `Driven and solution-focused ${role} candidate currently completing a ${degree}. Demonstrated technical proficiency in ${skillsList} through hands-on project development and practical internship experience. Passionate about engineering clean, maintainable software systems and contributing to high-impact technical initiatives.`;
  }

  static generateBullet(input, mode = 'professional') {
    const raw = (input || '').replace(/^[-•*]\s*/, '').trim();
    if (!raw) return 'Developed scalable application feature with optimized performance.';

    const actionVerbs = ['Architected', 'Engineered', 'Developed', 'Designed', 'Implemented', 'Constructed'];
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

    if (mode === 'short') {
      return `${randomVerb} ${raw.toLowerCase()} to streamline user workflow and system functionality.`;
    } else if (mode === 'achievement') {
      return `${randomVerb} ${raw.toLowerCase()}, enhancing data processing efficiency and reliability.`;
    } else {
      return `${randomVerb} a responsive ${raw.toLowerCase()} application, implementing clean modular architecture and robust API endpoints.`;
    }
  }

  static generateInterviewQuestions(resume) {
    const questions = [];
    const projects = resume?.projects || [];
    const skills = resume?.skills || {};
    const exp = resume?.experience || [];

    projects.forEach(p => {
      questions.push({
        claim: `Project: ${p.name}`,
        question: `Could you walk me through the architecture of ${p.name} and how you selected ${p.technologies?.join(', ') || 'its tech stack'}?`,
        category: 'Basic',
        expectedFocus: 'System design choices & component structure'
      });
      questions.push({
        claim: `Technologies: ${p.technologies?.join(', ') || 'REST APIs'}`,
        question: `In ${p.name}, how did you handle error cases, validation, and network performance?`,
        category: 'Intermediate',
        expectedFocus: 'Error handling & API resilience'
      });
    });

    exp.forEach(e => {
      questions.push({
        claim: `Role: ${e.role} at ${e.organization}`,
        question: `During your work as ${e.role}, what was the most complex debugging or integration challenge you faced, and how did you resolve it?`,
        category: 'Advanced',
        expectedFocus: 'Troubleshooting & practical problem solving'
      });
    });

    if (skills.languages?.includes('Java') || skills.frameworks?.includes('Spring Boot')) {
      questions.push({
        claim: 'Skill: Java / Spring Boot',
        question: 'Explain the difference between Dependency Injection and Inversion of Control in Spring Boot, and why it is beneficial.',
        category: 'Basic',
        expectedFocus: 'Spring Core fundamentals'
      });
      questions.push({
        claim: 'Skill: REST API',
        question: 'What HTTP status codes and response formats did you use when designing your RESTful endpoints?',
        category: 'Intermediate',
        expectedFocus: 'REST best practices'
      });
    }

    if (questions.length === 0) {
      questions.push({
        claim: 'General Software Engineering',
        question: 'Tell me about a technical project you built from scratch and the key lessons you learned.',
        category: 'Basic',
        expectedFocus: 'Project breakdown'
      });
    }

    return questions;
  }

  static generateCoverLetter(resume, jobDescription) {
    const name = resume?.personalInfo?.fullName || 'Ajitha D R';
    const role = jobDescription?.title || resume?.targetRole || 'Junior Software Developer';
    const company = jobDescription?.company || 'Target Tech Company';
    const skills = resume?.skills?.languages ? [...resume.skills.languages, ...(resume.skills.frameworks || [])].join(', ') : 'Java, Spring Boot, React, and SQL';

    return `Dear Hiring Manager at ${company},

I am writing to express my strong enthusiasm for the ${role} position. As an Information Technology student with hands-on technical experience in ${skills}, I am eager to apply my software development expertise to support your engineering team's goals.

Through my academic coursework and project initiatives—such as developing the Smart University Event Management system and completing a Full Stack Java internship—I have cultivated strong skills in microservices architecture, RESTful API design, and relational database management. I pride myself on writing clean, well-tested code and quickly mastering new frameworks.

What excites me most about ${company} is your commitment to technical innovation. My background in building responsive frontend interfaces connected to reliable backend services aligns closely with your requirements for this role.

Thank you for considering my application. I look forward to the opportunity to discuss how my skill set and passion for software engineering can contribute to ${company}.

Sincerely,
${name}
${resume?.personalInfo?.email || ''} | ${resume?.personalInfo?.phone || ''}`;
  }

  static analyzeSkillGap(resumeSkills = [], jobSkills = []) {
    const normalizedResume = resumeSkills.map(s => s.toLowerCase().trim());
    const matched = [];
    const missing = [];
    const partial = [];

    jobSkills.forEach(skill => {
      const lower = skill.toLowerCase().trim();
      if (normalizedResume.includes(lower)) {
        matched.push(skill);
      } else if (normalizedResume.some(rs => rs.includes(lower) || lower.includes(rs))) {
        partial.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const roadmap = [
      ...missing.map((s, idx) => ({
        skill: s,
        status: 'Missing',
        priority: idx === 0 ? 'High' : 'Medium',
        suggestedTopic: `Core concepts, official documentation, and hands-on mini project implementing ${s}.`
      })),
      ...partial.map(s => ({
        skill: s,
        status: 'Partial',
        priority: 'Medium',
        suggestedTopic: `Advanced patterns, security practices, and error handling for ${s}.`
      }))
    ];

    return { matched, missing, partial, roadmap };
  }
}

export async function generateSummary(data) {
  if (hasOpenAI()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getApiKey()}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Write a concise 3-4 sentence professional summary for a student resume. Education: ${JSON.stringify(data.education)}, Skills: ${JSON.stringify(data.skills)}, Target Role: ${data.targetRole}` }],
          temperature: 0.7
        })
      });
      const result = await response.json();
      if (result.choices?.[0]?.message?.content) {
        return result.choices[0].message.content.trim();
      }
    } catch (e) {
      console.warn('OpenAI API call failed, using Mock AI fallback:', e.message);
    }
  }
  return MockAIEngine.generateSummary(data);
}

export async function generateBullet(input, mode) {
  if (hasOpenAI()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getApiKey()}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Enhance this resume bullet point into a strong ${mode} bullet point using action verbs without inventing fake statistics: "${input}"` }],
          temperature: 0.6
        })
      });
      const result = await response.json();
      if (result.choices?.[0]?.message?.content) {
        return result.choices[0].message.content.trim().replace(/^[-•*]\s*/, '');
      }
    } catch (e) {
      console.warn('OpenAI bullet call failed, using Mock AI:', e.message);
    }
  }
  return MockAIEngine.generateBullet(input, mode);
}

export async function generateInterviewQuestions(resume, targetJob) {
  return MockAIEngine.generateInterviewQuestions(resume, targetJob);
}

export async function generateCoverLetter(resume, jobDescription) {
  return MockAIEngine.generateCoverLetter(resume, jobDescription);
}

export async function analyzeSkillGap(resumeSkills, jobSkills) {
  return MockAIEngine.analyzeSkillGap(resumeSkills, jobSkills);
}
