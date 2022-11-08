const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const signUp = async (req, res, next) => {
  let token, hashedPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      message: "Provided data is not valid please enter valid data",
    });
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message:
        "Can't lookup user for that email. Please check back after sometime.",
    });
  }

  if (existingUser) {
    return res.status(422).json({
      error: true,
      message: "This email already exists. Please try logging in instead.",
    });
  }

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Signing up failed. Please check back after sometime.",
    });
  }

  const createdUser = new User({
    email,
    support: "",
    nickname: "",
    challenges: [],
    stepsSkipped: "",
    stepsCompleted: [],
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Signing up failed. Please check back after sometime.",
    });
  }

  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Can't create user at the moment. Try again later",
    });
  }
  res.status(201).json({
    token,
    user: { ...createdUser.toObject({ getters: true }), password: null },
  });
};

const login = async (req, res, next) => {
  let token, existingUser, isPasswordValid;
  const { email, password } = req.body;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Can't login user. Please check back after sometime.",
    });
  }

  if (!existingUser) {
    return res.status(404).json({
      error: true,
      message: "User does not exist. Signup instead!",
    });
  }

  try {
    isPasswordValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Can't login user. Please check back after sometime.",
    });
  }

  if (!isPasswordValid) {
    return res.status(401).json({
      error: true,
      message: "Invalid credentials. Log In failed",
    });
  }

  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Can't login user at the moment. Try again later",
    });
  }

  res.json({
    token,
    user: { ...existingUser.toObject({ getters: true }), password: null },
  });
};

exports.login = login;
exports.signUp = signUp;
