const contentMeter = require('./content-meter');
const gam = require('./gam');
const identityX = require('./identity-x');
// const identityXOptInHooks = require('./identity-x-opt-in-hooks');
const nativeX = require('./native-x');
const navigation = require('./navigation');
const newsletter = require('./newsletter');
const omeda = require('./omeda');
const omedaIdentityX = require('./omeda-identity-x');
const search = require('./search');

module.exports = {
  // module configs
  includeOsano: process.env.USE_OSANO === 'true',
  contentMeter,
  gam,
  useLinkInjectedBody: process.env.USE_LINK_INJECTED_BODY === 'true',
  identityX,
  // identityXOptInHooks,
  nativeX,
  navigation,
  newsletter,
  omeda,
  omedaIdentityX,
  search,
  // theme configs
  idxNavItems: {
    enable: process.env.IDX_NAV_ENABLE || false,
  },
  company: 'Randall-Reilly, LLC',
  p1events: {
    tenant: 'randallreilly',
    enabled: true,
    cookieDomain: process.env.NODE_ENV === 'production' ? 'truckersnews.com' : '',
  },
  logos: {
    navbar: {
      src: 'https://img.truckersnews.com/files/base/randallreilly/all/image/static/tn/tn-logo.svg?h=45&auto=format,compress',
      srcset: [
        'https://img.truckersnews.com/files/base/randallreilly/all/image/static/tn/tn-logo.svg?h=45&auto=format,compress&dpr=2 2x',
      ],
      width: 66,
      height: 35,
    },
    footer: {
      src: 'https://img.truckersnews.com/files/base/randallreilly/all/image/static/tn/tn-logo-white.svg?h=60&auto=format,compress',
      srcset: [
        'https://img.truckersnews.com/files/base/randallreilly/all/image/static/tn/tn-logo-white.svg?h=60&auto=format,compress&dpr=2 2x',
      ],
    },
    corporate: {
      alt: 'Randall-Reilly Logo',
      href: 'https://www.randallreilly.com',
      src: 'https://img.truckersnews.com/files/base/randallreilly/all/image/static/rr-logo.svg?w=200&auto=format,compress',
      srcset: [
        'https://img.truckersnews.com/files/base/randallreilly/all/image/static/rr-logo.svg?w=200&auto=format,compress&dpr=2 2x',
      ],
    },
  },
  socialMediaLinks: [
    { provider: 'facebook', href: 'https://www.facebook.com/TruckersNews/', target: '_blank' },
    { provider: 'twitter', href: 'https://twitter.com/truckersnews', target: '_blank' },
    { provider: 'youtube', href: 'https://www.youtube.com/channel/UC55CJCUhEdHwOcQ_A4c9U9g', target: '_blank' },
  ],
  gcse: {
    id: 'cf19a2a833a06d9d4',
  },
  oneTrust: [
    { path: '/collection', oneTrustIds: ['c04235aa-e9e0-4ff9-b558-5e21aa892d20'] },
    {
      path: '/termsandprivacy',
      oneTrustIds: [
        '0e533e95-c4d0-415f-9f16-a9f2e3840ff8',
        'd6a774b4-bf5c-46a8-b8b9-0b12da49ef4b',
      ],
    },
  ],
  gtm: {
    containerId: 'GTM-KKR45JP',
  },
  wufoo: {
    userName: 'randallreilly',
  },
  inquiry: {
    enabled: false,
    directSend: false,
    sendTo: 'support@parameter1.com',
    sendFrom: 'TruckersNews.com <noreply@parameter1.com>',
    logo: 'https://img.truckersnews.com/files/base/randallreilly/all/image/static/tn/tn-logo.svg?h=45&auto=format,compress&bg=000000&pad=5',
    bgColor: '#000000',
  },
  sponsoredLabelLogos: {
    'Sponsored by RoadPro': {
      src: 'https://img.overdriveonline.com/files/base/randallreilly/all/image/static/road-pro-logo.png?auto=format&w=109&fit=crop',
      width: '109px',
    },
  },
  sponsoredSectionNameLogos: {
    gear: {
      src: 'https://img.overdriveonline.com/files/base/randallreilly/all/image/static/ovd/trucker-gear-logo.png?auto=format&w=275&fit=crop',
      width: '275px',
    },
  },
};
