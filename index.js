require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./schemas/userSchema");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digital-event-scheduler-system.web.app",
      "https://digital-event-scheduler-system.firebaseapp.com",
    ],
    credentials: true,
  })
);

const db_username = process.env.db_username;
const db_password = process.env.db_password;

const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.ashqk.mongodb.net/EVENT_SCHEDULER?retryWrites=true&w=majority&appName=Cluster0`;

try {
  mongoose.connect(uri);
  console.log("Connected to db.");
} catch {
  console.log("Can not connect with db.");
}

// Save user api starts
app.post("/users", async (req, res) => {
  try {
    const userInfo = req.body;
    const user = new User({ ...userInfo });

    await user.save();
    res.send({ acknowledged: true, message: "User saved successfully." });
  } catch {
    res.send({ acknowledged: false, message: "Can not save user." });
  }
});
// Save user api ends

app.post("/jwt", (req, res) => {
  const email = req.body;
  const token = jwt.sign({ email }, process.env.jwt_secret, {
    expiresIn: "1h",
  });

  res.cookie("EVENT_SCHEDULER", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.send({ acknowledged: true, message: "Cookie saved" });
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
