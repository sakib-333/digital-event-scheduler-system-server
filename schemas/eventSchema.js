const { Schema, default: mongoose } = require("mongoose");

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  photo: {
    type: String,
    default: "https://i.ibb.co.com/FLWX4bfj/Event-Default-Logo.png",
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["exam", "fest", "tour", "game", "others"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  participant: {
    type: String,
    required: [true, "Participant is required"],
    enum: ["teachers", "students", "anyone"],
  },
  date: {
    type: Date,
    required: [true, "Participant is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  status: {
    type: String,
    enum: ["approved", "pending"],
    default: "pending",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
