const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const onboardingRoutes = require("./routes/onboarding-routes");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/users", usersRoutes);
app.use("/onboarding", onboardingRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route...", 404);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nodeapp.puztd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(port, () => {
      console.log(`Connected! Listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
