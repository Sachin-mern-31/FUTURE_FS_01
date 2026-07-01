const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Name, email, and message are required.",
    });
  }

  try {
    const savedMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });
    console.log(savedMessage);
    return res.status(201).json({ success: true, data: savedMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ error: "Unable to save message." });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Unable to fetch messages." });
  }
});

module.exports = router;
