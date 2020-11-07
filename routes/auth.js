var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get('/', function (req, res) {
  res.render("landing");
});

//register form
router.get("/register", function (req, res) {
  res.render("register");
});
//handle logic logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "  Welcome to ChillSpace  " + user.username);
      res.redirect("/chillspace");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});
//handle login form
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/chillspace",
    failureRedirect: "/login"
  }), function (req, res) {
  });
//logout
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/chillspace");
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;