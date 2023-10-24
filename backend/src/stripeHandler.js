const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const createPaymentIntent = async (amount) => {
  return await stripe.paymentIntents.create({
    amount: amount,
    currency: "dkk",
    payment_method_types: ["card"],
  });
};

module.exports = {
  createPaymentIntent,
};
