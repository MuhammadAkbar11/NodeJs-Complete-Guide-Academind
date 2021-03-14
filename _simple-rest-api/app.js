require("dotenv").config();

const express = require("express");

const feedRoutes = require("./routes/feed");

const app = express();

app.use("/api/feed", feedRoutes);

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  console.log("listening... PORT " + PORT);
});
