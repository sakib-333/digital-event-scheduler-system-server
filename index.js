require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./schemas/userSchema");
const Event = require("./schemas/eventSchema");

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

const checkToken = (req, res, next) => {
  const token = req?.cookies?.EVENT_SCHEDULER;

  if (!token) {
    return res.status(403).send({ message: "Unauthorized access" });
  } else {
    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Unauthorized access" });
      }
      req.decodedEmail = decoded.email.email;
      next();
    });
  }
};

const checkUser = (req, res, next) => {
  const { email } = req.body;

  if (email !== req.decodedEmail) {
    return res.status(403).send({ message: "Unauthorized access" });
  }
  next();
};

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

// Send cookie starts
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
// Send cookie ends

// Clear cookie when logged out start
app.post("/logout", (req, res) => {
  res.clearCookie("EVENT_SCHEDULER", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  res.send({ acknowledged: true, message: "Cookie cleared" });
});
// Clear cookie when logged out end

// get user info starts
app.post("/user", checkToken, checkUser, async (req, res) => {
  const { email } = req.body;

  try {
    const userInfo = await User.findOne({ email }).exec();
    res.send(userInfo);
  } catch (err) {
    console.log(err);
  }
});
// get user info ends

// Get user type starts
app.post("/user-type", checkToken, checkUser, async (req, res) => {
  const { email } = req.body;

  try {
    const { userType = "general" } = await User.findOne(
      { email },
      "userType"
    ).exec();

    res.send(userType);
  } catch (err) {
    console.log(err);
  }
});
// Get user type end

// Add event api starts
app.post("/add-event", checkToken, checkUser, async (req, res) => {
  try {
    const { eventInfo } = req.body;
    const event = new Event({ ...eventInfo });

    await event.save();
    res.send({ acknowledged: true, message: "Event saved successfully" });
  } catch (err) {
    console.log(err);
    res.send({ acknowledged: false, message: "Something went wrong." });
  }
});
// Add event api end

app.post("/my-events", checkToken, checkUser, async (req, res) => {
  const { email } = req.body;
  try {
    const myEvents = await Event.find(
      { author: email },
      "photo title description date location category"
    )
      .sort({ updatedAt: -1 })
      .exec();
    res.send({ acknowledged: true, myEvents });
  } catch (err) {
    res.send({ acknowledged: false, myEvents: [] });
  }
});

app.post("/my-event", checkToken, checkUser, async (req, res) => {
  const { eventID } = req.body;
  try {
    const myEvent = await Event.findById(
      eventID,
      "title description participant category location date"
    );

    res.send({ acknowledged: true, myEvent });
  } catch (err) {
    res.send({ acknowledged: false, myEvent: {} });
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
