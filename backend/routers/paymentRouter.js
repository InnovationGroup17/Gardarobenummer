const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../src/stripeHandler");

//Router Endpoint
router.post("/intents", async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await createPaymentIntent(amount);
  res.json(paymentIntent);
});

module.exports = router;
