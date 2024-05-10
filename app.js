const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");

const User = require("./models/user");
const bcryptjs = require("bcryptjs")

require("dotenv").config();

const mongoDB = process.env.MONGODB_URI;

async function main() {
  await mongoose.connect(mongoDB);
}

main().catch(e => console.log(e));


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: mongoDB,
  })
}));

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username })
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const match = await bcryptjs.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrent password." })
      }

      return done(null, user);
    } catch (err) {
      next(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");

app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
