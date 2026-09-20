import { StorageService } from './storageService';
import { selectRelevantProjects } from './careerService';
import { generateSummary } from './aiService';

export async function tailorResume(userId = 'user_001', resumeId = 'resume_001', jobRequirements) {
  const originalResume = StorageService.findById('resumes', resumeId) || StorageService.getCollection('resumes')[0];

  if (!originalResume) {
    throw new Error('Original resume not found.');
  }

  const selectedProjects = selectRelevantProjects(userId, jobRequirements);
  const topProjects = selectedProjects.slice(0, 3).map(p => ({
    id: p.id,
    name: p.title,
    role: 'Developer',
    technologies: p.technologies || ['Java', 'SQL'],
    description: p.description,
    link: ''
  }));

  const newSummary = await generateSummary({
    education: originalResume.education,
    skills: jobRequirements.requiredSkills,
    projects: topProjects,
    targetRole: jobRequirements.title || 'Java Developer'
  });

  const targetReqSkills = (jobRequirements.requiredSkills || []).map(s => s.trim());
  const existingLanguages = originalResume.skills?.languages || [];
  const existingFrameworks = originalResume.skills?.frameworks || [];

  const prioritizedFrameworks = Array.from(new Set([...targetReqSkills.filter(s => ['Spring Boot', 'React', 'Node.js', 'Express', 'Flask'].includes(s)), ...existingFrameworks]));
  const prioritizedLanguages = Array.from(new Set([...targetReqSkills.filter(s => ['Java', 'Python', 'C++', 'JavaScript'].includes(s)), ...existingLanguages]));

  const tailoredResume = {
    ...originalResume,
    targetRole: jobRequirements.title || originalResume.targetRole,
    summary: newSummary,
    skills: {
      ...originalResume.skills,
      languages: prioritizedLanguages,
      frameworks: prioritizedFrameworks
    },
    projects: topProjects.length > 0 ? topProjects : originalResume.projects,
    tailoredForJob: jobRequirements.title,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  StorageService.updateById('resumes', resumeId, tailoredResume);
  return tailoredResume;
}
