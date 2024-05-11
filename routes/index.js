const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Message = require("../models/message.js");

router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ date_of_post: -1 })
      .populate("author")
      .exec();

    res.render("index", { title: "The Club", user: req.user, messages: messages });
  } catch (err) {
    next(err)
  }
})

module.exports = router;
