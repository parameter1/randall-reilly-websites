const navigation = require('./navigation');
const gam = require('./gam');
const nativeX = require('./native-x');
const identityX = require('./identity-x');
const newsletter = require('./newsletter');

module.exports = {
  navigation,
  gam,
  nativeX,
  identityX,
  newsletter,
  company: 'Randall-Reilly, LLC',
  p1events: {
    tenant: 'randallreilly',
    enabled: true,
    cookieDomain: process.env.NODE_ENV === 'production' ? 'totallandscapecare.com' : '',
  },
  logos: {
    navbar: {
      src: 'https://img.totallandscapecare.com/files/base/randallreilly/all/image/static/tlc/tlc-logo.svg?h=45&auto=format,compress&q=70',
      srcset: [
        'https://img.totallandscapecare.com/files/base/randallreilly/all/image/static/tlc/tlc-logo.svg?h=90&auto=format,compress&q=70 2x',
      ],
    },
    footer: {
      src: 'https://img.totallandscapecare.com/files/base/randallreilly/all/image/static/tlc/tlc-logo.svg?h=60&auto=format,compress&q=70',
      srcset: [
        'https://img.totallandscapecare.com/files/base/randallreilly/all/image/static/tlc/tlc-logo.svg?h=120&auto=format,compress&q=70 2x',
      ],
    },
  },
  socialMediaLinks: [
    { provider: 'facebook', href: 'https://www.facebook.com/totallandscapecare/', target: '_blank' },
    { provider: 'twitter', href: 'https://twitter.com/TLConline', target: '_blank' },
    { provider: 'linkedin', href: 'https://www.linkedin.com/showcase/total-landscape-care-partner-solutions/', target: '_blank' },
    { provider: 'youtube', href: 'https://www.youtube.com/channel/UC2oQucc3ULCnu09wude37-Q', target: '_blank' },
    { provider: 'instagram', href: 'https://www.instagram.com/TotalLandscapeCareOnline', target: '_blank' },
  ],
  gcse: {
    id: '2ffbde674775e605d',
  },
  oneTrust: [
    { path: '/collection', id: 'c04235aa-e9e0-4ff9-b558-5e21aa892d20' },
    { path: '/termsandprivacy', id: 'd8f2d6c5-d9af-4d60-a93f-7441ca9ad94c' },
  ],
  gtm: {
    containerId: 'GTM-TQW695L',
  },
  wufoo: {
    userName: 'randallreilly',
  },
};
