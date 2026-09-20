import { StorageService } from './storageService';

export function verifyClaims(userId = 'user_001', resumeData = {}) {
  const vaultItems = StorageService.findByUserId('career_vault', userId);

  const verifiedSkills = new Set();
  const verifiedTechs = new Set();
  const verifiedProjects = new Set();

  vaultItems.forEach(item => {
    if (item.title) verifiedProjects.add(item.title.toLowerCase());
    (item.skills || []).forEach(s => verifiedSkills.add(s.toLowerCase()));
    (item.technologies || []).forEach(t => verifiedTechs.add(t.toLowerCase()));
  });

  const findings = [];
  let supportedCount = 0;
  let unsupportedCount = 0;

  // 1. Check summary claim for unverified statistics
  const summaryText = resumeData?.summary || '';
  if (summaryText) {
    const statMatches = summaryText.match(/\d+[\d,]*%|\d+[\d,]*\s*(users|clients|requests|downloads|stars|percent)/gi);
    if (statMatches) {
      statMatches.forEach(stat => {
        findings.push({
          type: 'unverified_metric',
          field: 'Professional Summary',
          claim: stat,
          status: 'unsupported',
          message: `The metric "${stat}" in your summary is not backed by evidence in your Career Vault.`
        });
        unsupportedCount++;
      });
    }
  }

  // 2. Check Projects claims
  const projects = resumeData?.projects || [];
  projects.forEach((proj, idx) => {
    const projName = proj.name || `Project ${idx + 1}`;
    const matchesVault = Array.from(verifiedProjects).some(vp => vp.includes(projName.toLowerCase()) || projName.toLowerCase().includes(vp));
    
    if (!matchesVault && projName) {
      findings.push({
        type: 'missing_vault_project',
        field: `Projects - ${projName}`,
        claim: projName,
        status: 'unsupported',
        message: `Project "${projName}" is not registered in your Career Vault.`
      });
      unsupportedCount++;
    } else {
      supportedCount++;
    }

    const projDesc = proj.description || '';
    const statsInProj = projDesc.match(/\d+[\d,]*\s*(users|customers|downloads|k|m|requests|\%)/gi);
    if (statsInProj) {
      statsInProj.forEach(metric => {
        const vaultProj = vaultItems.find(v => v.title && v.title.toLowerCase().includes(projName.toLowerCase()));
        const vaultEvidence = (vaultProj?.evidence || '') + (vaultProj?.description || '');
        if (!vaultEvidence.toLowerCase().includes(metric.toLowerCase())) {
          findings.push({
            type: 'unverified_metric',
            field: `Project: ${projName}`,
            claim: metric,
            status: 'unsupported',
            message: `Metric "${metric}" in "${projName}" description has no proof recorded in Career Vault.`
          });
          unsupportedCount++;
        }
      });
    }
  });

  // 3. Check listed resume skills
  const resumeSkillsList = [];
  if (resumeData?.skills) {
    Object.values(resumeData.skills).forEach(val => {
      if (Array.isArray(val)) resumeSkillsList.push(...val);
    });
  }

  resumeSkillsList.forEach(skill => {
    const sLower = skill.toLowerCase();
    const isVerified = Array.from(verifiedSkills).includes(sLower) || Array.from(verifiedTechs).includes(sLower);
    if (!isVerified) {
      findings.push({
        type: 'unverified_skill',
        field: 'Skills',
        claim: skill,
        status: 'unsupported',
        message: `Skill "${skill}" is not documented in any Career Vault record.`
      });
      unsupportedCount++;
    } else {
      supportedCount++;
    }
  });

  const totalClaims = supportedCount + unsupportedCount || 1;
  const truthScore = Math.round((supportedCount / totalClaims) * 100);

  return {
    verified: unsupportedCount === 0,
    truthScore: Math.min(100, Math.max(0, truthScore)),
    supportedCount,
    unsupportedCount,
    findings,
    checkedAt: new Date().toISOString()
  };
}
