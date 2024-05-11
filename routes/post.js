const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");

router.get("/post", (req, res, next) => {
  if (req.user) {
    return res.render("post", { title: "New post" });
  }

  return res.redirect("/login")
});

router.post("/post",
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must be provided"),

  body("message")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message must be provided"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const message = new Message({
        title: req.body.title,
        body: req.body.message,
        author: req.user._id,
      })

      if (!errors.isEmpty()) {
        return res.render("post", {
          title: "New post",
          message: message,
          errors: errors.array(),
        })
      }

      await message.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
