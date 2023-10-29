const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  _date: { type: Date, default: Date.now },
  isDone: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
