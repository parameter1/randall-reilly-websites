const { withDynamicPage } = require('@parameter1/base-cms-marko-web/middleware');
const queryFragment = require('../graphql/fragments/dynamic-page');
const page = require('../templates/dynamic-page');

module.exports = (app) => {
  app.get('/page/:alias(*)', withDynamicPage({
    template: page,
    queryFragment,
  }));
};
