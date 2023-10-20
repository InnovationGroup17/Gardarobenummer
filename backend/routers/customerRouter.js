const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

//Router Endpoint
//Create a new customer
router.post("/create", async (req, res) => {
  try {
    //check if the request body contains the email and name
    if (!req.body.email || !req.body.name) {
      throw new Error("Missing email or name");
    }
    //check if the email is valid
    if (!req.body.email.includes("@") && !req.body.email.includes(".")) {
      throw new Error("Invalid email: missing @ or .");
    }
    //check if the customer already exists
    const customerList = await stripe.customers.list({
      email: req.body.email,
    });
    if (customerList.data.length > 0) {
      return res.json({
        customer: customerList.data[0],
        message: "Customer already exists",
        status: 200,
      });
    }

    //create a new customer
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
    });
    res.json({ customer: customer, message: "Customer Created", status: 200 });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

module.exports = router;
