const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

//Router Endpoint
router.post("/intents", async (req, res) => {
  console.log(req.body.amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "dkk",
      payment_method_types: ["card"],
      capture_method: "manual",
    });
    const clientSecret = paymentIntent.client_secret;

    res.json({ clientSecret: clientSecret });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

module.exports = router;
