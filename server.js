const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// JSON File Helper
async function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

async function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename.endsWith('.json') ? filename : `${filename}.json`);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// User Routes
app.get('/api/users/:id', async (req, res) => {
  const users = await readJson('users.json');
  const user = users.find(u => u.id === req.params.id) || users[0];
  res.json(user);
});

// Resume Routes
app.get('/api/resumes/user/:userId', async (req, res) => {
  const resumes = await readJson('resumes.json');
  res.json(resumes);
});

app.post('/api/resumes', async (req, res) => {
  const resumes = await readJson('resumes.json');
  const newResume = { id: `resume_${Date.now()}`, ...req.body };
  resumes.unshift(newResume);
  await writeJson('resumes.json', resumes);

  const versions = await readJson('resume_versions.json');
  versions.unshift({
    id: `ver_${Date.now()}`,
    userId: newResume.userId,
    name: newResume.title,
    targetRole: newResume.targetRole,
    template: newResume.template,
    resumeId: newResume.id,
    createdAt: new Date().toISOString().split('T')[0]
  });
  await writeJson('resume_versions.json', versions);

  res.status(201).json(newResume);
});

// Career Vault Routes
app.get('/api/career-vault/:userId', async (req, res) => {
  const vault = await readJson('career_vault.json');
  res.json(vault);
});

app.post('/api/career-vault', async (req, res) => {
  const vault = await readJson('career_vault.json');
  const newItem = { id: `cv_${Date.now()}`, ...req.body };
  vault.unshift(newItem);
  await writeJson('career_vault.json', vault);
  res.status(201).json(newItem);
});

// Jobs & ATS Routes
app.get('/api/jobs', async (req, res) => {
  const jobs = await readJson('jobs.json');
  res.json(jobs);
});

app.get('/api/ats_analysis', async (req, res) => {
  const ats = await readJson('ats_analysis.json');
  res.json(ats);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', storage: 'Node.js fs JSON Storage' });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js/Express JSON Server running on http://localhost:${PORT}`);
});
