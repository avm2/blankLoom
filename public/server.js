require("dotenv").config();
const express = require("express");
const path = require("path");
const orderRoute = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/order", orderRoute);

app.listen(PORT, () => {
  console.log(`Blankloom server running at http://localhost:${PORT}`);
});
