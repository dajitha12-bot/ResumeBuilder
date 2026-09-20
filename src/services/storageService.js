import usersSeed from '../data/users.json';
import resumesSeed from '../data/resumes.json';
import vaultSeed from '../data/career_vault.json';
import atsSeed from '../data/ats_analysis.json';
import versionsSeed from '../data/resume_versions.json';

const SEEDS = {
  users: usersSeed,
  resumes: resumesSeed,
  career_vault: vaultSeed,
  ats_analysis: atsSeed,
  resume_versions: versionsSeed
};

export class StorageService {
  static getCollection(collectionName) {
    const stored = localStorage.getItem(`ai_resume_${collectionName}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing ${collectionName} from localStorage:`, e);
      }
    }
    const defaultData = SEEDS[collectionName] || [];
    localStorage.setItem(`ai_resume_${collectionName}`, JSON.stringify(defaultData));
    return defaultData;
  }

  static saveCollection(collectionName, data) {
    localStorage.setItem(`ai_resume_${collectionName}`, JSON.stringify(data));
  }

  static findById(collectionName, id) {
    const list = this.getCollection(collectionName);
    return list.find(item => item.id === id) || null;
  }

  static findByUserId(collectionName, userId) {
    const list = this.getCollection(collectionName);
    return list.filter(item => item.userId === userId || !item.userId);
  }

  static createRecord(collectionName, record, prefix = 'rec') {
    const list = this.getCollection(collectionName);
    const now = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: record.id || `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...record,
      createdAt: record.createdAt || now,
      updatedAt: now
    };
    list.unshift(newRecord);
    this.saveCollection(collectionName, list);
    return newRecord;
  }

  static updateById(collectionName, id, updates) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString().split('T')[0];
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: now
    };
    this.saveCollection(collectionName, list);
    return list[index];
  }

  static deleteById(collectionName, id) {
    const list = this.getCollection(collectionName);
    const filtered = list.filter(item => item.id !== id);
    this.saveCollection(collectionName, filtered);
    return filtered.length !== list.length;
  }
}
