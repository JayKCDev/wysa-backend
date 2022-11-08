const User = require("../models/User");
const { validationResult } = require("express-validator");

const ONBOARDING_SCREENS = Object.freeze({
  SUPPORT: "Support",
  NICKNAME: "Nickname",
  CHALLENGES: "Challenges",
});

const onboard = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      message: "Provided data is not valid please enter valid data",
    });
  }

  const { userId } = req.userData;

  let stepsSkipped,
    existingUser,
    stepsCompleted = [];

  const { nickname, support, challenges } = req.body;

  if (!challenges.length) {
    stepsSkipped = ONBOARDING_SCREENS.CHALLENGES;
  } else {
    stepsSkipped = "";
    stepsCompleted.push(ONBOARDING_SCREENS.CHALLENGES);
  }

  if (nickname) {
    stepsCompleted.push(ONBOARDING_SCREENS.NICKNAME);
  }

  if (support) {
    stepsCompleted.push(ONBOARDING_SCREENS.SUPPORT);
  }

  try {
    existingUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          support: support,
          nickname: nickname,
          challenges: challenges,
          stepsSkipped: stepsSkipped,
          stepsCompleted: stepsCompleted,
        },
      },
      {
        new: true,
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong couldn't complete onboarding process.",
    });
  }

  if (!existingUser) {
    return res.status(401).json({
      error: true,
      message: "Invalid credentials. Log in failed",
    });
  }

  res.status(201).json({
    user: { ...existingUser.toObject({ getters: true }), password: null },
  });
};

exports.onboard = onboard;
