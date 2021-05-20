const router = require("express").Router();
const { isSignedIn, isAdmin } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
router.param("deliveredById", async (req, res, next, id) => {
  try {
    let deliveredBoy = await User.findOne({ _id: id, role: 1 });
    if (!deliveredBoy) {
      throw new Error();
    }
    req.deliveredBoy = deliveredBoy;
    next();
  } catch {
    res.send({
      error: "delivery boy not found",
    });
  }
});

router.post(
  "/addDeliveryBoy",
  isSignedIn,
  isAdmin,
  [
    body("email", "enter correct email").isEmail(),
    body("password", "password should be minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(422).send({
          error: errors.array()[0].msg,
        });
      }
      req.body.role = 1;
      const deliveryBoy = new User(req.body);
      await deliveryBoy.save();
      deliveryBoy.password = undefined;
      res.send(deliveryBoy);
    } catch (e) {
      console.log(e.name, e.code);
      if (e.code == 11000 && e.name == "MongoError") {
        return res.status(400).send({
          error: "Email is already exists",
        });
      }
      res.status(400).send({
        error: "Can't add devlivery Boy please try again later",
      });
    }
  }
);
router.get("/getAllDeliveryBoys", isSignedIn, isAdmin, async (req, res) => {
  try {
    const boys = await User.find({ role: 1 });
    if (!boys) {
      return res.send({ msg: "No delivery boys found" });
    }
    res.send(boys);
  } catch (e) {
    res.status(404).send({ error: "Could not get delivery boys" });
  }
});

module.exports = router;
