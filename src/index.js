require("dotenv").config({});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// db connection
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// middlewares
app.use(cors({}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

// import routes
const authRoutes = require("./routes/auth.route.js");

// use routes
app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
