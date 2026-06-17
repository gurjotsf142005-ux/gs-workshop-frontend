const SiteSetting = require('../models/SiteSetting');

async function getOrCreate() {
  let s = await SiteSetting.findOne();
  if (!s) s = await SiteSetting.create({});
  return s;
}

exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.status(200).json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site settings.' });
  }
};

exports.updateSiteSettings = async (req, res) => {
  try {
    const allowedFields = [
      // Navbar
      'navName', 'navBrand', 'navStatus', 'navCta', 'navLinks',
      // Hero
      'heroEyebrow', 'heroHeadline', 'heroDescription', 'heroPrimaryCta',
      'heroSecondaryCta', 'heroImage', 'heroImageAlt', 'heroBadge', 'heroBrand',
      'heroMiniCards', 'techStack',
      // Marquee
      'marqueeItems',
      // Stats
      'stats',
      // Services
      'servicesEyebrow', 'servicesHeadline', 'servicesDescription',
      'servicesCta', 'servicesCtaUrl', 'services',
      // Projects intro
      'projectsEyebrow', 'projectsHeadline', 'projectsDescription',
      'projectsCta', 'projectsCtaUrl',
      // About
      'aboutEyebrow', 'aboutHeadline', 'aboutTextOne', 'aboutTextTwo', 'aboutCards',
      // Contact
      'contactEyebrow', 'contactHeadline', 'contactDescription', 'contactName',
      'contactEmail', 'contactInstagram', 'contactGithub', 'contactButtonText',
      // Footer
      'footerBrand', 'footerCopy', 'footerLinks',
    ];

    const updates = {};
    allowedFields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) updates[f] = req.body[f];
    });

    const existing = await getOrCreate();
    const settings = await SiteSetting.findByIdAndUpdate(
      existing._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Settings updated.', settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Failed to update site settings.' });
  }
};
