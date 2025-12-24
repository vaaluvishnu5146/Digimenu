const mongooose = require("mongoose");

// Raw query schema for Orders
/**
 * Paste one or more documents here
 */
// {
//   "_id": {
//     "$oid": "694c020f110b9fa9d708c5cb"
//   },
//   "tableNumber": "1A",
//   "items": [
//     {
//       "itemName": "Idli",
//       "quantity": 1,
//       "price": 30
//     }
//   ],
//   "totalAmount": 30,
//   "status": "pending"
// }

const OrderSchema = new mongooose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
    },
    items: [
      {
        itemName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "served", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongooose.model("Order", OrderSchema);
