const Project = require('../models/Project');
const SiteSetting = require('../models/SiteSetting');

// ── Project Controllers ──────────────────────────────────────────────────────
exports.getAdminProjects = async (req, res) => {
  try {
    const { limit, featured } = req.query;
    let query = {};
    if (featured === 'true') query.featured = true;
    
    const projects = await Project.find(query)
      .limit(parseInt(limit) || 50)
      .sort({ order: 1 });
      
    res.json({ projects });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// ── Site Settings Controllers ──────────────────────────────────────────────
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({}); // Seed default if none
    }
    res.json({ settings });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.findOneAndUpdate({}, req.body, { 
      new: true, 
      upsert: true 
    });
    res.json({ settings });
  } catch (err) { res.status(400).json({ error: err.message }); }
};