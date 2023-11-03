const express = require("express");  // Import the Express framework.
const router = express.Router();  // Create an Express router.
const mongoose = require("mongoose");  // Import Mongoose for database operations.
const crypto = require('crypto');  // Import the Crypto module for ETag generation.

function generateETag(content) {
  const hash = crypto.createHash('sha256');  // Create a SHA-256 hash object for ETag generation.
  hash.update(content);  // Update the hash with the provided content.
  const etag = hash.digest('hex');  // Generate the ETag as a hexadecimal string.
  return etag;  // Return the ETag.
}

// Import the Task model for working with tasks in the database.
const Task = require("../models/task");

// Define a route for getting all tasks.
router.get("/", (req, res, next) => {
  Task.find()  // Find all tasks in the database.
    .select("title isDone _date _id")  // Select specific fields to return in the response.
    .exec()  // Execute the query.
    .then((docs) => {
      const response = {
        status: 200,
        count: docs.length,
        tasks: docs.map((doc) => {
          return {
            _id: doc._id,
            title: doc.title,
            isDone: doc.isDone,
            date: doc._date,
            request: {
              type: "GET",
              url: "http://localhost:8080/tasks/" + doc._id,
            },
          };
        }),
      };
      if (docs.length >= 0) {
        const etag = generateETag(JSON.stringify(response));  // Generate an ETag for the response.
        if (req.headers["if-None-Match"] === etag) {
          res.status(304);  // Respond with a 304 status code if the ETag matches.
        } else {
          res.set('ETag', etag);  // Set the ETag header in the response.
          res.status(200).json(response);  // Respond with a 200 status code and the JSON response.
        }
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Define a route for creating a new task.
router.post("/", (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
  });
  task
    .save()  // Save the new task to the database.
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Task created successfully",
        createdTask: {
          _id: result._id,
          title: result.title,
          isDone: result.isDone,
          date: result._date,
          request: {
            type: "GET",
            description: "GET unique task",
            url: "http://localhost:8080/tasks/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Define a route for getting a specific task by ID.
router.get("/:taskId", (req, res, next) => {
  const id = req.params.taskId;
  Task.findById(id)
    .select("title isDone _date _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          status: 200,
          task: doc,
          request: {
            type: "GET",
            description: "GET all tasks",
            url: "http://localhost:8080/tasks/",
          },
        });
      } else
        res.status(404).json({
          status: 404,
          message: "No Valid entry found for provided ID",
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Define a route for updating a specific task by ID.
router.put("/:taskId", (req, res, next) => {
  const id = req.params.taskId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Task.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Task has been updated",
        request: {
          type: "GET",
          url: "http://localhost:8080/tasks/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Define a route for deleting a specific task by ID.
router.delete("/:taskId", (req, res, next) => {
  const id = req.params.taskId;
  Task.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Task has been deleted",
        request: {
          type: "POST",
          url: "http://localhost:8080/tasks/",
          body: {
            title: "String",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;  // Export the router for use in the main application.
