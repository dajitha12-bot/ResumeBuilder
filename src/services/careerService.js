import { StorageService } from './storageService';

export function getSkillEvidence(userId = 'user_001', targetSkill) {
  const vaultItems = StorageService.findByUserId('career_vault', userId);
  const skillLower = targetSkill.toLowerCase().trim();

  const evidenceGraph = {
    skill: targetSkill,
    projects: [],
    internships: [],
    certifications: []
  };

  vaultItems.forEach(item => {
    const itemSkills = (item.skills || []).map(s => s.toLowerCase().trim());
    const itemTechs = (item.technologies || []).map(t => t.toLowerCase().trim());
    const matches = itemSkills.includes(skillLower) || itemTechs.includes(skillLower) || item.title?.toLowerCase().includes(skillLower);

    if (matches) {
      if (item.type === 'project') {
        evidenceGraph.projects.push({
          id: item.id,
          title: item.title,
          proof: item.evidence || item.description,
          technologies: item.technologies || []
        });
      } else if (item.type === 'internship') {
        evidenceGraph.internships.push({
          id: item.id,
          title: `${item.role} at ${item.organization || item.title}`,
          proof: item.evidence || item.description,
          technologies: item.technologies || []
        });
      } else if (item.type === 'certification') {
        evidenceGraph.certifications.push({
          id: item.id,
          title: item.title,
          proof: item.evidence || item.source,
          date: item.date
        });
      }
    }
  });

  return evidenceGraph;
}

export function selectRelevantProjects(userId = 'user_001', jobRequirements) {
  const vaultItems = StorageService.findByUserId('career_vault', userId);
  const projects = vaultItems.filter(item => item.type === 'project');

  const reqSkills = (jobRequirements.requiredSkills || []).map(s => s.toLowerCase());
  const jobKeywords = (jobRequirements.keywords || []).map(k => k.toLowerCase());

  const rankedProjects = projects.map(proj => {
    const projSkills = (proj.skills || []).concat(proj.technologies || []).map(s => s.toLowerCase());
    const matchedSkills = [];

    reqSkills.forEach(req => {
      if (projSkills.some(ps => ps.includes(req) || req.includes(ps))) {
        matchedSkills.push(req);
      }
    });

    jobKeywords.forEach(kw => {
      if (projSkills.some(ps => ps.includes(kw) || kw.includes(ps)) && !matchedSkills.includes(kw)) {
        matchedSkills.push(kw);
      }
    });

    const matchCount = matchedSkills.length;
    let stars = 3;
    if (matchCount >= 4) stars = 5;
    else if (matchCount >= 2) stars = 4;
    else if (matchCount === 1) stars = 3;
    else stars = 2;

    const matchedDisplay = matchedSkills.map(s => s.toUpperCase()).join(', ');

    return {
      id: proj.id,
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies,
      evidence: proj.evidence,
      stars,
      matchCount,
      rationale: matchedSkills.length > 0
        ? `Selected because the project contains ${matchedDisplay} matching the job requirements.`
        : `General technical project displaying application development capability.`
    };
  });

  rankedProjects.sort((a, b) => b.stars - a.stars);
  return rankedProjects;
}
