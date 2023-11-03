const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require('crypto');



function generateETag(content) {
  const hash = crypto.createHash('sha256'); // You can use a different hash algorithm if needed
  hash.update(content);
  const etag = hash.digest('hex');
  return etag;
}

// import Model
const Task = require("../models/task");

router.get("/", (req, res, next) => {
  Task.find()
    .select("title isDone _date _id")
    .exec()
    .then((docs) => {
      console.log(docs);
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
        const etag = generateETag(JSON.stringify(response))
        if (req.headers["if-None-Match"] === etag) {
          res.status(304);
        } else {
          res.set('ETag', etag);
          res.status(200).json(response);
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
/*
 *  {
 *    "title": "faire à manger"
 *  }
 */
router.post("/", (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
  });
  task
    .save()
    .then((result) => {
      console.log(result);
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

router.get("/:taskId", (req, res, next) => {
  const id = req.params.taskId;
  Task.findById(id)
    .select("title isDone _date _id")
    .exec()
    .then((doc) => {
      console.log(`From the database: ${doc}`);
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
/*
 * [{"propName": "title", "value": "Faire les courses"}]
 */
router.put("/:taskId", (req, res, next) => {
  const id = req.params.taskId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Task.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
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

module.exports = router;
