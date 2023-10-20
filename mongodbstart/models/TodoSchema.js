const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todo = new Schema({
  title: {
    type: String,
    require: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  dateTime: {
    type: Date,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("todos", todo);
