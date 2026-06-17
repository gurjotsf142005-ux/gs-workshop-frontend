const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, unique: true, lowercase: true, trim: true },
  desc:      { type: String, required: true },
  imageURL:  { type: String, required: true },
  techStack: { type: [String], default: [] },
  liveURL:   { type: String, default: '' },
  githubURL: { type: String, default: '' },
  featured:  { type: Boolean, default: false },
  status:    { type: String, enum: ['published', 'draft'], default: 'published' },
  order:     { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
