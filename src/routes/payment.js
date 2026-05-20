const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const User = require("../models/user");
const crypto = require("crypto");
// Middleware to capture raw body for signature validation
paymentRouter.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);

function validateWebhookSignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, //its 50000 paisa means its 500 rupees
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });
    // save it in my db
    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //return my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    //console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");

    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      req.rawBody,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      console.log("Invalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    const event = req.body.event;
    console.log("Webhook Event:", event);

    // Only handle payment events
    if (event === "payment.captured" || event === "payment.failed") {
      const paymentDetails = req.body.payload.payment.entity;
      console.log("Payment Details:", paymentDetails);

      // Update Payment document
      const payment = await Payment.findOne({
        orderId: paymentDetails.order_id,
      });
      if (payment) {
        payment.status = paymentDetails.status;
        await payment.save();
        console.log("Payment updated:", payment);
      } else {
        console.log("No Payment found for orderId:", paymentDetails.order_id);
      }

      // Update User document
      if (payment) {
        const user = await User.findById(payment.userId);
        if (user) {
          user.isPremium = paymentDetails.status === "captured";
          user.membershipType = paymentDetails.notes.membershipType;
          await user.save();
          console.log("User updated:", user);
        } else {
          console.log("No User found for payment.userId:", payment.userId);
        }
      }
    }

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ msg: err.message });
  }
});
module.exports = paymentRouter;
