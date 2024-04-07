const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const config = require("./server.config");
const cors = require("cors");
app.use(
  cors({
    origin: config.client.url,
  })
);

app.post("/generateToken", async (req, res) => {
  fetch(config.portalAuth.generateTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${config.portalAuth.username}&password=${
      config.portalAuth.password
    }&f=json&expiration=1440&referer=${req.get("referer")}&client=${req.get(
      "referer"
    )}&ip=${req.ip}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Token generated successfully:", data);
      var token = data.token;

      if (!token) {
        console.error("Error generating token:", data);
        res.status(500).json({
          error: "Error generating token",
        });
      }
      res.json({
        token,
      });
    })
    .catch((error) => {
      console.error("Error generating token:", error);
      res.status(500).json({
        error: "Error generating token",
      });
    });
});

app.listen(config.server.port, config.server.host, () => {
  console.log(
    `Server running at http://${config.server.host}:${config.server.port}/`
  );
});
