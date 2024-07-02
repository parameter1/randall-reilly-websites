const home = require('./home');
const content = require('./content');
const websiteSections = require('./website-section');
const staticPages = require('./static');

module.exports = (app) => {
  // Homepage
  home(app);

  // Content Pages
  content(app);

  // Static Pages
  staticPages(app);

  // Website Sections
  websiteSections(app);
};
