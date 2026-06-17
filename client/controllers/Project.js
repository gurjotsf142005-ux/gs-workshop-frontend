const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const { featured, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (featured === 'true') filter.featured = true;

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ order: 1, createdAt: -1 }).limit(Number(limit)).skip(skip),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({
      projects,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ message: 'Project created.', project });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A project with this title already exists.' });
    res.status(400).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project updated.', project });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A project with this title already exists.' });
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete.' });
  }
};
