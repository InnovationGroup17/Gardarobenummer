const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

/*
//Router Endpoint
router.post("/intents", async (req, res) => {
  console.log(req.body);

  try {
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: req.body.customer },
      { apiVersion: "2023-08-16" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      customer: req.body.customer,
      amount: req.body.amount,
      currency: "dkk",
      payment_method_types: ["card"],
      capture_method: "manual",
    });
    const clientSecret = paymentIntent.client_secret;

    console.log("Client Secret: ", clientSecret);
    console.log("Payment Intent: ", paymentIntent);
    console.log("Ephemeral Key: ", ephemeralKey);

    res.json({ clientSecret: clientSecret, message: "Payment Intent Created" });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});
*/

//router to update the paymentIntent to captured
router.post("/capture", async (req, res) => {
  console.log(req.body.paymentId);
  try {
    const paymentIntent = await stripe.paymentIntents.capture(
      req.body.paymentId
    );
    res.json({ paymentIntent: paymentIntent });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post("/payment-sheet", async (req, res) => {
  console.log("Req body: ", req.body);
  try {
    // Use an existing Customer ID if this is a returning customer.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: req.body.customer },
      { apiVersion: "2023-08-16" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "dkk",
      customer: req.body.customer,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: "manual",
    });

    console.log("Payment Intent: ", paymentIntent);

    res.json({
      paymentId: paymentIntent.id,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: req.body.customer,
      publishableKey:
        "pk_test_51NzHQxAu5ko6Dm7GK9HSzRghvBoupGKUR6lHq6HYKGsXwvivhQI2tjHgQdJmf9tOmfmqU8eUx18KPnTJzfHwJYEw00IesVKr6x",
    });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
});

module.exports = router;
