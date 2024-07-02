const EERouter = require('@randall-reilly/equipment-experts');
const home = require('./home');
const content = require('./content');
const staticPages = require('./static');
const websiteSections = require('./website-section');

module.exports = (app) => {
  // Homepage
  home(app);

  // Equipment Experts API
  const { parseEmbeddedMedia } = app.locals;
  app.use('/api/marketplace-articles', EERouter({ parseEmbeddedMedia, sectionAlias: 'equipment-experts' }));

  // Content Pages
  content(app);

  // Static Pages
  staticPages(app);

  // Website Sections
  websiteSections(app);
};
