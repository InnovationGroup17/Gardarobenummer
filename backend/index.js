require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const paymentRouter = require("./routers/paymentRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
