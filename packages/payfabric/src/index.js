const { asyncRoute } = require('@parameter1/base-cms-utils');
const { json } = require('express');
const pretaxAmount = require('./utils/pre-tax-amount');
const calculateSalesTax = require('./utils/calculate-sales-tax');

const PayFabricAPIClient = require('./client');
const {
  PAYFABRIC_DEVICE_ID,
  PAYFABRIC_DEVICE_PWD,
  PAYFABRIC_GATEWAY_NAME,
} = require('./env');

const client = new PayFabricAPIClient({
  deviceId: PAYFABRIC_DEVICE_ID,
  devicePwd: PAYFABRIC_DEVICE_PWD,
  gateway: PAYFABRIC_GATEWAY_NAME,
});

const createError = (message, code) => {
  const error = new Error(message);
  if (code) error.code = code;
  return error;
};

const countryCodesRequireZip = new Set(['US', 'CA']);

/**
 * @typedef ResponseContext
 * @prop {import('@parameter1/base-cms-marko-web-identity-x/service')} identityX
 *
 * @typedef IdentityXContext
 * @prop {IdxAppContext} application
 * @prop {IdxUserContext} user
 * @prop {Boolean} hasUser
 *
 * @typedef IdxAppContext
 * @typedef IdxUserContext
 */
module.exports = (app) => {
  /**
   * Handles requests to start a payment transaction
   */
  app.post('/__payfabric/create-transaction-token', json(), asyncRoute(async (req, res) => {
    try {
      const { body } = await req;
      const {
        vin,
        countryCode,
        email,
        zip: postalCode,
      } = body;
      if (!vin) throw createError('You must provide a VIN to continue.', 400);
      if (!email) throw createError('You must provide an email address to continue.', 400);
      if (!postalCode && countryCodesRequireZip.has(countryCode)) throw createError('You must provide a zip code to continue', 400);

      /** @type {ResponseContext} */
      const { identityX } = res.locals;
      /** @type {IdentityXContext} */
      const ctx = await identityX.loadActiveContext();
      const user = ctx.hasUser ? ctx.user : { email };
      // Ensure a postalCode is provided even if existing user record doesn't have one
      if (!user.postalCode && postalCode) user.postalCode = postalCode;
      // Ensure a countryCode is provided even if existing user record doesn't have one
      if (!user.countryCode && countryCode) user.countryCode = countryCode;

      const salesTax = countryCodesRequireZip.has(user.countryCode) ? await calculateSalesTax({
        postalCode,
        pretaxAmount,
      }) : 0;
      const amount = Number((pretaxAmount + salesTax).toFixed(2));
      const { Key } = await client.createTransaction({ user, vin, amount });
      const { Token } = await client.createJWT({ transactionId: Key });
      res.json({ Token, salesTax });
    } catch (error) {
      res.status(error.code || 500).json({ error: error.message });
    }
  }));

  return client;
};
