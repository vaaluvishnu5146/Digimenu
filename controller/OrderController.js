const OrderSchema = require("../model/OrderSchema");

const OrderController = require("express").Router();

// Create a new order
OrderController.post("/create", async (req, res) => {
  try {
    const { tableNumber, items, totalAmount } = req.body;
    const newOrder = new OrderSchema({
      tableNumber,
      items,
      totalAmount,
    });
    await newOrder.save();
    console.log("Order created:", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = OrderController;
