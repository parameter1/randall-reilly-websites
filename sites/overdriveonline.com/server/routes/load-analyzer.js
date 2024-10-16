const load = require('@randall-reilly/package-global/templates/static/load-analyzer/index');
const loadAnalyzer = require('@randall-reilly/package-global/templates/static/load-analyzer/load-analyzer');

const { get } = require('@parameter1/base-cms-object-path');

module.exports = (app) => {
  app.get('/load-analyzer/submit', (req, res) => {
    const hasCookie = Boolean(get(req, 'cookies.loadAnalyzer'));
    const { payload } = hasCookie ? JSON.parse(get(req, 'cookies.loadAnalyzer')) : { payload: {} };
    res.marko(
      loadAnalyzer,
      payload,
    );
  });

  app.get('/load-analyzer', (req, res) => {
    // if reset present clear load cookie
    if (req.query && Boolean(req.query.reset) === true) {
      res.clearCookie('loadAnalyzer', 0);
    }
    res.marko(load);
  });
};
