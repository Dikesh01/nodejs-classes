const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Todo = require("./models/TodoSchema");
const user = require("./models/UserSchema");

const { LoggerMiddleware } = require("./middleware/LoggerMiddleware");
const { isAuth } = require("./middleware/AuthMiddleware");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(LoggerMiddleware);
const PORT = process.env.PORT;

// Post - Create todo!
app.post("/todo", isAuth, async (req, res) => {
  const { title, isCompleted, username } = req.body;

  if (title.length == 0 || isCompleted == null || username.length == 0) {
    return res.status(400).send({
      status: 400,
      message: "Please enter the values in correct formate!",
    });
  }

  try {
    const todoObj = new Todo({
      title,
      isCompleted,
      username,
      dateTime: new Date(),
    });

    await todoObj.save();

    res.status(201).send({
      status: 201,
      message: "Todo creation in mongodb is successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to create new todo in mongoDb!",
    });
  }
});

// Get - Get all todos for username
app.get("/todos/:username", isAuth, async (req, res) => {
  const username = req.params.username;
  const page = Number(req.query.page) || 1;
  const LIMIT = 5;

  try {
    const todoList = await Todo.find({ username })
    .sort({ dateTime: -1 })
    .skip((page - 1)* Limit )
    .limit(LIMIT);

    res.status(200).send({
      status: 200,
      message: "All todo by username fetched successfully!",
      data: todoList,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch all todos by username!",
    });
  }
});

// Get - Get a single todo!
app.get("/todo/:id", isAuth, (req, res) => {
  const todoId = req.params.id;

  Todo.findById(todoId)
    .then((todoData) => {
      res.status(200).send({
        status: 200,
        message: "Single to fetched by id successfully!",
        data: todoData,
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: "Failed to fetch single todo by Id!",
        data: err,
      });
    });
});

// Delete - Delete a single todo by id
app.delete("/todo/:id", isAuth, async (req, res) => {
  const todoId = req.params.id;
  try {
    await Todo.findByIdAndDelete(todoId);

    res.status(200).send({
      status: 200,
      message: "todo deleted successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to delete todo by id",
      data: err,
    });
  }
});

// Patch - update the todo by id
app.patch("/todo", isAuth, async (req, res) => {
  const { id, title, isCompleted } = req.body;

  try {
    await Todo.findByIdAndUpdate(id, { title, isCompleted });
    res.status(200).send({
      status: 200,
      message: "todo updated successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to update todo by id",
      data: err,
    });
  }
});

//-------------------------------------------------------------------------------------

// new registration of user
app.post("/register", async (req, res) => {
  const userBody = req.body;
  const SALT_ROUNDS = 12;

  const hashedPassword = await bcrypt.hash(userBody.password, SALT_ROUNDS);

  const userObj = new user({
    name: userBody.name,
    username: userBody.username,
    email: userBody.email,
    password: hashedPassword,
  });

  try {
    await userObj.save();

    res.status(201).send({
      status: 201,
      message: "New user registerd successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to register new user!",
    });
  }
});

// Post - User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let userData;

  try {
    userData = await user.findOne({ username });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch user!",
      data: err,
    });
  }

  const isPasswordSame = await bcrypt.compare(password, userData.password);

  if (!isPasswordSame) {
    res.status(400).send({
      status: 400,
      message: "Incorrect password!",
    });
  } else {
    const payload = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.status(200).send({
      status: 200,
      message: "User loggedin successfully!",
      data: token,
    });
  }
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB is now connected!"))
  .catch((err) => console.log(err));

app.listen(PORT, (res, req) => {
  console.log("Server is running at Port: ", PORT);
});
