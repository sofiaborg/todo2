const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const db = require("../database");
const dateTime = require("node-datetime");

//the urlencoded method within body-parser tells body-parser to extract data from the <form>
//element and add them to the body property in the request object.
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

//GET all the tasks <<from the database>> and render them to start-page
router.get("/", async (req, res) => {
  const collection = await db.getTaskCollection();
  const tasksArr = await collection.find().toArray();
  res.render("start", { tasksArr });
});

//CREATE new task and add timestamp
router.post("/", async (req, res) => {
  let dt = dateTime.create();
  let formatted = dt.format("Y-m-d H:M:S");
  const addTask = {
    description: req.body.description,
    time: formatted,
    status: false,
  };

  const taskCollection = await db.getTaskCollection();
  await taskCollection.insertOne(addTask);

  res.redirect("/");
});

//EDIT task
router.get("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);
  const taskCollection = await db.getTaskCollection();
  taskCollection.findOne({ _id: id }, (err, task) => {
    res.render("edit", task);
  });
});

router.post("/:id/edit", async (req, res) => {
  const id = ObjectId(req.params.id);

  const editTask = {
    description: req.body.description,
  };

  const taskCollection = await db.getTaskCollection();
  await taskCollection.updateOne({ _id: id }, { $set: editTask });
  res.redirect("/");
});

//STATUS for task
router.get("/:id/status", (req, res) => {
  res.render("/");
});

router.post("/:id/status", async (req, res) => {
  const id = ObjectId(req.params.id);

  const editStatus = {
    status: Boolean(req.body.status),
  };

  const taskCollection = await db.getTaskCollection();
  await taskCollection.updateOne({ _id: id }, { $set: editStatus });
  res.redirect("/");
});

//DELETE task
router.get("/:id/delete", (req, res) => {
  res.render("/");
});

router.post("/:id/delete", async (req, res) => {
  const id = ObjectId(req.params.id);
  const taskCollection = await db.getTaskCollection();
  await taskCollection.deleteOne({ _id: id });
  res.redirect("/");
});

//SORT based on status
router.get("/done", async (req, res) => {
  const taskCollection = await db.getTaskCollection();
  const doneArr = await taskCollection.find({ status: true }).toArray();

  res.render("done", { doneArr });
});

router.get("/undone", async (req, res) => {
  const taskCollection = await db.getTaskCollection();
  const undoneArr = await taskCollection.find({ status: false }).toArray();

  res.render("undone", { undoneArr });
});

//SORT based on new/old
router.get("/oldest", async (req, res) => {
  const taskCollection = await db.getTaskCollection();
  const tasksArr = await taskCollection.find().sort({ time: 1 }).toArray();

  res.render("start", { tasksArr });
});

router.get("/newest", async (req, res) => {
  const taskCollection = await db.getTaskCollection();
  const tasksArr = await taskCollection.find().sort({ time: -1 }).toArray();

  res.render("start", { tasksArr });
});

module.exports = router;
