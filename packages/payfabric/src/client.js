const fetch = require('node-fetch');
const debug = require('debug')('payfabric');
const { inspect } = require('util');
const { PAYFABRIC_ENV } = require('./env');

const API_BASEURL = `https://${PAYFABRIC_ENV === 'SANDBOX' ? 'sandbox' : 'www'}.payfabric.com`;

/**
 * The PayFabric API client
 * @see https://github.com/PayFabric/APIs/tree/master/PayFabric
 */
module.exports = class ApiClient {
  /**
   * @param {Object} a
   * @param {String} a.deviceId     The PayFabric Device ID (include DCN prefix!)
   * @param {String} a.devicePwd    The PayFabric Device password
   * @param {String} a.gatewayName  The PayFabric payment gateway to use
   */
  constructor({
    deviceId,
    devicePwd,
    gatewayName = 'EVO US_CC',
  } = {}) {
    this.deviceId = deviceId;
    this.devicePwd = devicePwd;
    this.gatewayName = gatewayName;
    this.token = null;
    this.expires = 0;
  }

  /**
   * Makes a request to PayFabric, logging if enabled.
   * @see https://github.com/PayFabric/APIs/blob/93a22ffaa81342dabc2850ff2e9d4adab4093095/PayFabric/Sections/Authentication.md
   *
   * @param {Object} args
   * @param {String} args.endpoint  The API endpoint to use. It must be prefixed with a /
   * @param {String} args.body      The request body. If present, it must be JSON stringified
   * @param {Object} args.headers   The request headers
   * @param {String} args.method    The request method (GET/POST)
   * @returns Promise
   */
  async request({
    endpoint,
    body,
    headers: reqHeaders = {},
    method = 'post',
  } = {}) {
    const url = `${API_BASEURL}${endpoint}`;
    const headers = {
      ...reqHeaders,
      authorization: `${this.deviceId}|${this.devicePwd}`,
      'content-type': 'application/json',
    };
    const result = await fetch(url, { method, body, headers });

    if (!result.ok) {
      debug(`${method.toUpperCase()} ${url} ERR`, inspect({
        request: {
          headers: JSON.stringify({ ...headers, authorization: 'Bearer [redacted]' }),
          ...(body && { body }),
        },
        response: {
          status: `${result.status} ${result.statusText}`,
          headers: JSON.stringify(result.headers.raw()),
          body: await result.text(),
        },
      }, { depth: null, colors: true }));
      const error = new Error(`PayFabric response unsuccessful: ${result.status} ${result.statusText}`);
      error.code = result.status;
      throw error;
    }
    debug(`${method.toUpperCase()} ${url} OK `);
    return result.json();
  }

  /**
   * Creates a PayFabric Transaction
   * @see https://github.com/PayFabric/APIs/blob/93a22ffaa81342dabc2850ff2e9d4adab4093095/PayFabric/Sections/Transactions.md#create-a-transaction
   *
   * @typedef IdentityXUserContext
   * @prop {String} id
   * @prop {String} email
   * @prop {Boolean} verified
   * @prop {Number} verifiedCount
   * @prop {String} givenName
   * @prop {String} familyName
   * @prop {String} displayName
   * @prop {String} organization
   * @prop {String} organizationTitle
   * @prop {String} countryCode
   * @prop {String} regionCode
   * @prop {String} postalCode
   * @prop {String} city
   * @prop {String} street
   * @prop {String} addressExtra
   * @prop {String} phoneNumber
   *
   * @param {Object} args
   * @param {IdentityXUserContext} args.user
   * @param {String} args.vin @todo memo/note?
   */
  async createTransaction({ user, vin, amount }) {
    return this.request({
      endpoint: '/payment/api/transaction/create',
      body: JSON.stringify({
        // @todo additional details, customer reference?
        Amount: amount,
        Currency: 'USD',
        Customer: user.id || user.email,
        SetupId: this.gatewayName,
        Shipto: {
          City: user.city,
          Country: user.countryCode,
          Customer: user.id || user.email,
          Email: user.email,
          Line1: user.street,
          Line2: user.addressExtra,
          Phone: user.phoneNumber,
          State: user.regionCode,
          Zip: user.postalCode,
        },
        TrxUserDefine1: `VIN: ${vin}`,
        // ECheckSetupId: 'EVO US_ACH',
        Type: 'Sale',
      }),
    });
  }

  /**
   * Creates a JWT to use with a hosted payment page
   * @see https://github.com/PayFabric/APIs/blob/93a22ffaa81342dabc2850ff2e9d4adab4093095/PayFabric/Sections/JWTToken.md
   * @returns Promise
   */
  async createJWT({ transactionId }) {
    return this.request({
      endpoint: '/payment/api/jwt/create',
      body: JSON.stringify({ Audience: 'PaymentPage', Subject: transactionId }),
    });
  }
};
