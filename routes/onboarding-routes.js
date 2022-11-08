const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const verifyJwt = require("../middleware/verify-jwt");
const onboardingController = require("../controllers/onboarding-controller");

router.use(verifyJwt);

router.post(
  "/onboard",
  [check("support").not().isEmpty(), check("nickname").not().isEmpty()],
  onboardingController.onboard
);

module.exports = router;
