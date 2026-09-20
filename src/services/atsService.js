export function calculateATSScore(resumeData = {}, jobRequirements = {}) {
  const reqSkills = jobRequirements.requiredSkills || ['Java', 'Spring Boot', 'REST API', 'MySQL'];
  const prefSkills = jobRequirements.preferredSkills || ['Docker', 'AWS', 'Git'];
  const jobKeywords = jobRequirements.keywords || ['Backend', 'REST API', 'Database'];

  const resumeSkills = [];
  if (resumeData.skills) {
    Object.values(resumeData.skills).forEach(val => {
      if (Array.isArray(val)) resumeSkills.push(...val);
    });
  }

  (resumeData.projects || []).forEach(p => {
    if (p.technologies) resumeSkills.push(...p.technologies);
  });
  (resumeData.experience || []).forEach(e => {
    if (e.technologies) resumeSkills.push(...e.technologies);
  });

  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase().trim()));

  let skillsScore = 0;
  const matchingSkills = [];
  const missingSkills = [];

  reqSkills.forEach(req => {
    if (resumeSkillsSet.has(req.toLowerCase().trim())) {
      matchingSkills.push({ skill: req, strength: 'Strong' });
      skillsScore += (25 / reqSkills.length);
    } else {
      missingSkills.push(req);
    }
  });

  prefSkills.forEach(pref => {
    if (resumeSkillsSet.has(pref.toLowerCase().trim())) {
      matchingSkills.push({ skill: pref, strength: 'Bonus' });
      skillsScore += (5 / Math.max(1, prefSkills.length));
    } else {
      if (!missingSkills.includes(pref)) missingSkills.push(pref);
    }
  });

  skillsScore = Math.min(30, Math.round(skillsScore));

  let keywordScore = 0;
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const matchingKeywords = [];
  const missingKeywords = [];

  jobKeywords.forEach(kw => {
    if (resumeText.includes(kw.toLowerCase())) {
      matchingKeywords.push(kw);
      keywordScore += (35 / jobKeywords.length);
    } else {
      missingKeywords.push(kw);
    }
  });
  keywordScore = Math.min(35, Math.round(keywordScore));

  let experienceScore = 15;
  const hasInternship = (resumeData.experience || []).length > 0;
  const hasProjects = (resumeData.projects || []).length >= 2;
  if (hasInternship && hasProjects) experienceScore = 20;
  else if (hasProjects) experienceScore = 17;

  let educationScore = 10;
  const eduDegree = resumeData.education?.[0]?.degree || '';
  if (!eduDegree) educationScore = 5;

  let formattingScore = 4;
  if (resumeData.personalInfo?.fullName && resumeData.personalInfo?.email && resumeData.summary) {
    formattingScore = 5;
  }

  const totalScore = Math.min(100, keywordScore + skillsScore + experienceScore + educationScore + formattingScore);

  const explanations = [];
  matchingSkills.forEach(item => {
    explanations.push(`✓ ${item.strength} match for ${item.skill}`);
  });

  if (hasProjects) {
    explanations.push(`✓ High relevance in academic & practical projects`);
  }

  missingSkills.forEach(skill => {
    explanations.push(`✗ ${skill} is missing from your resume`);
  });

  missingKeywords.forEach(kw => {
    explanations.push(`⚠ Keyword "${kw}" is absent in project bullet points`);
  });

  const suggestions = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Add projects or coursework highlighting missing skills: ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  return {
    atsScore: totalScore,
    breakdown: {
      keywordMatch: { score: keywordScore, max: 35 },
      skillsMatch: { score: skillsScore, max: 30 },
      experienceMatch: { score: experienceScore, max: 20 },
      educationMatch: { score: educationScore, max: 10 },
      formatting: { score: formattingScore, max: 5 }
    },
    matchingSkills: matchingSkills.map(m => m.skill),
    missingSkills,
    matchingKeywords,
    missingKeywords,
    explanations,
    suggestions,
    analyzedAt: new Date().toISOString()
  };
}
