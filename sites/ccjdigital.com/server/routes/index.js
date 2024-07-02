const home = require('./home');
const content = require('./content');
const top250 = require('./top250');
const websiteSections = require('./website-section');

module.exports = (app) => {
  // Homepage
  home(app);

  // Spec Guides
  top250(app);

  // Content Pages
  content(app);

  // Website Sections
  websiteSections(app);
};
