require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const paymentRouter = require("./routers/paymentRouter");
const customerRouter = require("./routers/customerRouter");
const ip = require("ip");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

//MODE
const isDevMode = process.env.MODE === "development";
const SERVER_URL = isDevMode
  ? `http://${ip.address()}:${port}`
  : `http://localhost:${port}`;

app.use(bodyParser.json());
app.use(cors());
app.use("/payments", paymentRouter);
app.use("/customers", customerRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at ${SERVER_URL}`);
});
