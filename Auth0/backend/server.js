const express = require("express");
const app = express();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

app.use(cors());

const jwtCheck = auth({
  audience: "http://get-token-url/",
  issuerBaseURL: "https://dev-34crl0ebsqxu7bk8.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

app.get("/", jwtCheck, (req, res) => {
  console.log("url hit");
  console.log(req.headers.authorization);
  res.json({ message: "response" });
});

app.listen(8000, () => {
  console.log("server started");
});
