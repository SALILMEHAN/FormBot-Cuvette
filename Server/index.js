const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookiesparser = require("cookie-parser");
const router = require("./Router/router.js");

const app = express();
app.use(express.json());
app.use(cookiesparser());
dotenv.config();

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://form-bot-cuvette.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGODB_LINK)
  .then(() => {
    console.log("Connected Succefully");
  })
  .catch((err) => {
    console.log("Error In Connecting  :", err);
  });

app.use("/Formbot", router);

app.listen(8080, (res, req) => {
  console.log("Listening to 8080");
});
