const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    //check if user exists
    if (!user) {
      throw new Error();
    }
    //compare passwords
    const isAuthenticated = await user.comparePasswords(req.body.password);
    if (!isAuthenticated) {
      throw new Error();
    }
    if (isAuthenticated) {
      //create token
      const token = user.createToken();
      user.password = undefined;
      res.send({ user, token });
    }
  } catch {
    res.status(400).send({
      error: "Incorrect credentials",
    });
  }
});

router.post(
  "/signup",
  [
    body("email", "enter correct email").isEmail(),
    body("password", "password should be minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send({
          error: errors.array()[0].msg,
        });
      }
      const user = new User(req.body);
      await user.save();
      const token = user.createToken();
      console.log(`Token generated is ${token}`);
      user.password = undefined;
      res.send({ user, token });
    } catch (e) {
      if (e.code == 11000 && e.name == "MongoError") {
        return res.status(400).send({
          error: "Email is already exists",
        });
      }
      res.status(400).send({
        error: "Can't signup please try again later",
      });
    }
  }
);

module.exports = router;
