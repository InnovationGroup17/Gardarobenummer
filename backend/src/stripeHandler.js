const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
  return await stripe.paymentIntents.create({
    amount: amount,
    currency: "dkk",
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

module.exports = {
  createPaymentIntent,
};
