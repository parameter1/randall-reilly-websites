const fetch = require('node-fetch');
const { AVATAX_API_HOST, AVATAX_HASHED_CREDENTIALS } = require('../env');

module.exports = async ({ postalCode, pretaxAmount }) => {
  const now = new Date();
  const request = await fetch(`${AVATAX_API_HOST}/api/v2/transactions/create`, {
    method: 'POST',
    headers: {
      'content-type': 'application-json',
      Authorization: `Basic ${AVATAX_HASHED_CREDENTIALS}`,
    },
    body: JSON.stringify({
      lines: [
        {
          quantity: 1,
          amount: pretaxAmount,
          // https://taxcode.avatax.avalara.com/search?q=DD040000
          taxCode: 'DD040000',
        },
      ],
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      customerCode: 'parameter1-website-customer',
      addresses: {
        singleLocation: {
          postalCode,
        },
      },
      currencyCode: 'USD',
    }),
  });
  if (!request.ok) throw new Error('Bad fetch response, AvaTax');
  const { totalTax } = await request.json();
  // totalTax is the amount of tax applied for this transaction
  return Number(totalTax);
};
