const { cleanEnv, str } = require('envalid');

module.exports = cleanEnv(process.env, {
  PAYFABRIC_DEVICE_ID: str({ desc: 'The PayFabric Device ID.' }),
  PAYFABRIC_DEVICE_PWD: str({ desc: 'The PayFabric Device password.' }),
  PAYFABRIC_GATEWAY_NAME: str({ desc: 'The name of the PayFabric Gateway to use.', default: 'EVO US_CC' }),
  PAYFABRIC_ENV: str({ desc: 'The Payfabric environment', choices: ['SANDBOX', 'LIVE'], default: 'SANDBOX' }),
  PAYFABRIC_PAYMENT_METHODS: str({ desc: 'A comma-separated list of enabled payment methods.', default: 'CreditCard,ApplePay,GooglePay' }),
  AVATAX_API_HOST: str({ desc: 'The Avatax API host', default: 'https://sandbox-rest.avatax.com' }),
  AVATAX_HASHED_CREDENTIALS: str({ desc: 'Base64 encoded credentials for the Avatax API' }),
});
