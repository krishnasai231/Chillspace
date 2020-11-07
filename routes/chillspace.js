var express = require("express");
var router = express.Router();
var Chillspace = require("../models/chills");


//INDEX show all chillspace
router.get("/", function (req, res) {
  //get all chilspaces form db
  Chillspace.find({}, function (err, allChillspaces) {
    if (err) {
      console.log(err);
    } else {
      res.render("chillspaces/index", { chillspace: allChillspaces, currentUser: req.user });
    }
  });
});
//NEW
router.get("/new", isLoggedIn, function (req, res) {
  res.render("chillspaces/new");
});
//CREATE
router.post("/", isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newchillspace = { name: name, image: image, description: desc, author: author }

  //Create a new chillspace  save to db
  Chillspace.create(newchillspace, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to chillspace page
      res.redirect("/chillspace");
    }
  });
});

//SHOW
router.get("/:id", function (req, res) {
  //find chillspace with provided id
  Chillspace.findById(req.params.id).populate("comments").exec(function (err, foundChillspace) {
    if (err) {
      console.log(err);
    } else {
      res.render("chillspaces/show", { chillspace: foundChillspace });
    }
  });
});


//edit chillsapce route
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
  Chillspace.findById(req.params.id, function (err, foundChillspace) {
    res.render("chillspaces/edit", { chillspace: foundChillspace });
  });
});

//update chillsapce route
router.put("/:id", checkCampgroundOwnership, function (req, res) {
  //find and update chillpace
  Chillspace.findByIdAndUpdate(req.params.id, req.body.chillspace, function (err, updatedChillspaces) {
    if (err) {
      res.redirect("/chillspace");
    } else {
      res.redirect("/chillspace/" + req.params.id);
    }
  });
});

//destroy chillspace route
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
  Chillspace.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/chillspace");
    } else {
      res.redirect("/chillspace");
    }
  });
});
//middleware

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Chillspace.findById(req.params.id, function (err, foundChillspace) {
      if (err) {
        req.flash("error", "Chillspaces not found");
        res.redirect("back");
      } else {
        //does user own this chillspace
        if (foundChillspace.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You Do Not Have Permissions TO DO THIS");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You Need To Be Log In FIRST");
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You Need To Be Log-In First");
  res.redirect("/login");
}

module.exports = router;