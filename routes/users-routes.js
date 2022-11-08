const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signUp
);

router.post("/login", usersController.login);

module.exports = router;
