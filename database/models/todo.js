const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
  text: String,
  createdBy: String,
  pic: String
});

const todoModel = new mongoose.model("dobbyImage", todoSchema);

module.exports = todoModel;