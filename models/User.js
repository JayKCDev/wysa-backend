const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const User = new Schema({
  support: { type: String },
  nickname: { type: String },
  stepsSkipped: { type: String },
  challenges: [{ type: String }],
  stepsCompleted: [{ type: String }],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", User);
