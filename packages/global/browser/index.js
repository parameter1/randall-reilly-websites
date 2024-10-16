import MonoRail from '@parameter1/base-cms-marko-web-theme-monorail/browser';

const LoadAnalyzer = () => import(/* webpackChunkName: "load-analyzer" */ './load-analyzer.vue');
const LoadToggler = () => import(/* webpackChunkName: "load-toggler" */ './load-toggler.vue');

export default (Browser) => {
  const { EventBus } = Browser;
  EventBus.$on('identity-x-login-link-sent', ({ data, source, additionalEventData }) => {
    if (additionalEventData.createdNewUser) {
      const { appUser } = data;
      const newIdentityXUser = { userId: appUser.id, source };
      window.dataLayer.push({ event: 'identity-x-created-new-user', newIdentityXUser });
    }
  });

  Browser.register('LoadAnalyzer', LoadAnalyzer);
  Browser.register('LoadToggler', LoadToggler);

  MonoRail(Browser);
};
