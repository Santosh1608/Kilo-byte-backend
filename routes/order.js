const router = require("express").Router();
const {
  isSignedIn,
  isAdmin,
  isDeliveryBoy,
  isCustomer,
} = require("../middleware/auth");
const Catalogue = require("../models/Catalogue");
const Order = require("../models/Order");
router.post("/addItemsToCatalogue", isSignedIn, isAdmin, async (req, res) => {
  try {
    const catalogue = new Catalogue(req.body);
    await catalogue.save();
    res.send(catalogue);
  } catch (e) {
    res.status(404).send({ error: "Could not add catalogue" });
  }
});
router.post("/addOrder", isSignedIn, async (req, res) => {
  try {
    console.log(req.body.order);
    const { items } = req.body.order;
    const itemNames = items.map((item) => item.name);
    const catalogueItems = await Catalogue.find({ name: { $in: itemNames } });
    if (catalogueItems.length == itemNames.length) {
      const newOrder = new Order(req.body.order);
      newOrder.orderBy = req.profile._id;
      newOrder.locations = catalogueItems.map((item) => {
        return {
          name: item.name,
          address:
            item.addresses[Math.floor(Math.random() * item.addresses.length)],
        };
      });
      await newOrder.save();
      return res.send(newOrder);
    }
    res.send({ error: "Some items are not available in our catalogue" });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Cannot add your order" });
  }
});

router.get("/getOrders", isSignedIn, async (req, res) => {
  try {
    const orders = await Order.find({ orderBy: req.profile._id });
    res.send(orders);
  } catch (e) {
    res.status(404).send({ error: "Could not get orders" });
  }
});
router.get("/deliveryOrders", isSignedIn, isDeliveryBoy, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBy: req.profile._id });
    if (!orders) {
      return res.send({ msg: "No orders found" });
    }
    res.send(orders);
  } catch (e) {}
});
router.get(
  "/updateOrderStatus/:status/:orderId",
  isSignedIn,
  isDeliveryBoy,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      order.status = req.params.status;
      if (!order) {
        res.status(404).send("Order not found");
      }
      await order.save();
      res.send(order);
    } catch (e) {
      console.log(e);
      res.status(404).send({ error: "Could not get order" });
    }
  }
);

router.post(
  "/assignDeliveryBoyToOrder/:orderId/:deliveryBoyId",
  isSignedIn,
  isAdmin,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      order.deliveryBy = req.params.deliveryBoyId;
      await order.save();
      res.send(order);
    } catch (e) {
      res.status(404).send({ error: "Could not assign" });
    }
  }
);

router.get(
  "/getOrderByStatus/:status",
  isSignedIn,
  isAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find({ status: req.params.status });
      if (!orders) return res.send({ msg: "No orders found" });
      res.send(orders);
    } catch (e) {
      res.send({ error: "could not get" });
    }
  }
);

module.exports = router;
