const mongoose = require("mongoose"); // Import the Mongoose library.

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Define a field for the unique ID of the task.
  title: { type: String, required: true }, // Define a field for the title of the task with validation for required property.
  _date: { type: Date, default: Date.now }, // Define a field for the creation date of the task with a default value of the current date and time.
  isDone: { type: Boolean, default: false }, // Define a field to track whether the task is done or not, with a default value of "false".
  userId: { type: String, required: true}
});

module.exports = mongoose.model("Task", taskSchema); // Create and export a Mongoose model named "Task" based on the taskSchema.
