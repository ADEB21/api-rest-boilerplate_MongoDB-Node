const mongoose = require("mongoose"); // Import the Mongoose library.

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Define a field for the unique ID of the task.
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match:  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema); // Create and export a Mongoose model named "Task" based on the taskSchema.
