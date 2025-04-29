import paypal from '@paypal/checkout-server-sdk';

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Currency conversion rate (INR to USD)
const INR_TO_USD_RATE = 0.012; // Update this with current exchange rate

export const convertToUSD = (inrAmount) => {
  return (inrAmount * INR_TO_USD_RATE).toFixed(2);
};

export default client; 