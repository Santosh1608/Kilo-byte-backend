require("dotenv").config();
require("./db");
const express = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/order");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8000;
app.use(authRoutes);
app.use(userRoutes);
app.use(orderRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
