const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const bcryptjs = require("bcryptjs")

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Sign Up" });
})

router.post("/signup",
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alpahanumeric characters."),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alpahanumeric characters."),

  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must not be empty.")
    .isEmail()
    .withMessage("Your email is not a valid email address."),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must not be empty"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const user = await User.findOne({ username: req.body.username });

      if (!errors.isEmpty() || user) {
        res.render("signup", {
          title: "Sign up",
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: req.body.password,
          errors: errors.array(),
          signup_error: "The user already exists",
        })
      }

      bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: hashedPassword
          })

          if (err) {
            next(err);
          }

          const result = await user.save();
          res.redirect("/");
        } catch (e) {
          return next(e);
        }
      })
    } catch (e) {
      next(e);
    }
  }
)

module.exports = router;
