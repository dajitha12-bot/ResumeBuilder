import { StorageService } from './storageService';
import * as aiService from './aiService';
import { extractJobRequirements } from './jobAnalyzer';
import { calculateATSScore } from './atsService';
import { getSkillEvidence, selectRelevantProjects } from './careerService';
import { tailorResume } from './resumeService';
import { verifyClaims } from './truthGuard';

export const api = {
  // User
  getUser: async (id = 'user_001') => {
    return StorageService.findById('users', id) || StorageService.getCollection('users')[0];
  },

  // Resumes
  getResumes: async (userId = 'user_001') => {
    return StorageService.findByUserId('resumes', userId);
  },
  getResumeById: async (id) => {
    return StorageService.findById('resumes', id);
  },
  createResume: async (data) => {
    const newResume = StorageService.createRecord('resumes', data, 'resume');
    StorageService.createRecord('resume_versions', {
      userId: newResume.userId,
      resumeId: newResume.id,
      name: newResume.title || 'New Resume',
      targetRole: newResume.targetRole || 'Software Engineer',
      template: newResume.template || 'modern'
    }, 'ver');
    return newResume;
  },
  updateResume: async (id, data) => {
    return StorageService.updateById('resumes', id, data);
  },
  deleteResume: async (id) => {
    return StorageService.deleteById('resumes', id);
  },
  getResumeVersions: async (userId = 'user_001') => {
    return StorageService.findByUserId('resume_versions', userId);
  },

  // Career Vault
  getCareerVault: async (userId = 'user_001') => {
    return StorageService.findByUserId('career_vault', userId);
  },
  addVaultItem: async (data) => {
    return StorageService.createRecord('career_vault', data, 'cv');
  },
  updateVaultItem: async (id, data) => {
    return StorageService.updateById('career_vault', id, data);
  },
  deleteVaultItem: async (id) => {
    return StorageService.deleteById('career_vault', id);
  },
  getSkillEvidence: async (userId = 'user_001', skill) => {
    return getSkillEvidence(userId, skill);
  },

  // Job & ATS
  analyzeJob: async (rawText, userId = 'user_001') => {
    const requirements = extractJobRequirements(rawText);
    return StorageService.createRecord('job_descriptions', {
      userId,
      rawText,
      ...requirements
    }, 'job');
  },
  matchJob: async (resumeData, jobRequirements) => {
    const reqSkills = jobRequirements.requiredSkills || [];
    const resumeSkills = [];
    if (resumeData.skills) {
      Object.values(resumeData.skills).forEach(val => {
        if (Array.isArray(val)) resumeSkills.push(...val);
      });
    }
    const matches = [];
    const missing = [];

    reqSkills.forEach(skill => {
      const isPresent = resumeSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs.toLowerCase()));
      if (isPresent) matches.push({ skill, status: 'Strong' });
      else missing.push(skill);
    });

    return { matches, missing };
  },
  selectProjects: async (userId = 'user_001', jobRequirements) => {
    return selectRelevantProjects(userId, jobRequirements);
  },
  tailorResume: async (userId = 'user_001', resumeId = 'resume_001', jobRequirements) => {
    return tailorResume(userId, resumeId, jobRequirements);
  },
  calculateATS: async ({ resumeData, jobRequirements, userId = 'user_001', resumeId = 'resume_001', jobId = 'job_001' }) => {
    const analysis = calculateATSScore(resumeData, jobRequirements);
    return StorageService.createRecord('ats_analysis', {
      userId,
      resumeId,
      jobId,
      ...analysis
    }, 'ats');
  },

  // AI Services
  generateAISummary: async (data) => {
    const summary = await aiService.generateSummary(data);
    return { summary };
  },
  generateAIBullet: async (input, mode) => {
    const bullet = await aiService.generateBullet(input, mode);
    return { bullet };
  },
  generateInterviewQuestions: async (resume, targetJob) => {
    const questions = await aiService.generateInterviewQuestions(resume, targetJob);
    return { questions };
  },
  generateCoverLetter: async (resume, jobDescription) => {
    const coverLetter = await aiService.generateCoverLetter(resume, jobDescription);
    return { coverLetter };
  },
  analyzeSkillGap: async (resumeSkills, jobSkills) => {
    return aiService.analyzeSkillGap(resumeSkills, jobSkills);
  },
  verifyClaims: async (userId = 'user_001', resumeData) => {
    return verifyClaims(userId, resumeData);
  }
};
