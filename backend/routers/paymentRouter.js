const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Router Endpoint
router.post("/intents", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "dkk",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
      status: "success",
      message: "PaymentIntent created",
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
      message: "PaymentIntent not created",
      status: "failed",
    });
  }
});

module.exports = router;
