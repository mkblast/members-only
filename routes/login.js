const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const passport = require("passport");

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login" });
})

router.post("/login",
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

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("login", {
        title: "Login",
        username: req.body.username,
        password: req.body.password,
      })
    }

    next();
  },

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
)

module.exports = router;
