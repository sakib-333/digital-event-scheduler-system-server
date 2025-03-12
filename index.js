require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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
  })
);

const db_username = process.env.db_username;
const db_password = process.env.db_password;

const uri = `mongodb+srv://${db_username}:${db_password}@cluster0.ashqk.mongodb.net/EVENT_SCHEDULER?retryWrites=true&w=majority&appName=Cluster0`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
