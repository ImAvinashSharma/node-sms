const express = require("express");
const app = express();
const core = require("cors");
require("dotenv").config();
const port = 3001;
const fast2sms = require("fast-two-sms");

const db_phone = [];

app.listen(port, () => console.log(`SMS app listening on port ${port}!`));

app.use(express.json());
app.use(core());

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/sms", async (req, res) => {
  const { phone, message } = req.body;
  if (db_phone.find(x => x === phone)) {
    return res.status(409).send("This Student is already present in the BUS");
  }
  const options = {
    authorization: process.env.SMS_API_KEY,
    message: message,
    numbers: [phone]
  };
  const response = await fast2sms.sendMessage(options);
  db_phone.push(phone);
  if (response.return) res.status(200).send(response);
  else res.status(500).send(response);
  console.log(db_phone);
});
