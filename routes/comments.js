var express = require("express");
var router = express.Router({ mergeParams: true });
var Chillspace = require("../models/chills")
var Comment = require("../models/comment");


// COMMENTS new//
router.get("/new", isLoggedIn, function (req, res) {
  console.log(req.params.id);
  Chillspace.findById(req.params.id, function (err, chillspace) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { chillspace: chillspace });
    }
  });
});
//comments create
router.post("/", isLoggedIn, function (req, res) {
  //lookup chillspaces using id
  Chillspace.findById(req.params.id, function (err, chillspace) {
    if (err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      res.redirect("/chillspace");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          chillspace.comments.push(comment);
          chillspace.save();
          console.log(comment);
          req.flash("success", "Successfully added Comment")
          res.redirect("/chillspace/" + chillspace._id);
        }
      })
    }
  });
});

//comments edit route
router.get("/:comment_id/edit", checkCommnetOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", { chillspace_id: req.params.id, comment: foundComment });
    }
  });
});
//comments update
router.put("/:comment_id", checkCommnetOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/chillspace/" + req.params.id);
    }
  });
});
//comment destroy route
router.delete("/:comment_id", checkCommnetOwnership, function (req, res) {
  //find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/chillspace/+req.params.id");
    }
  });
});

//middleware
function checkCommnetOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("error", "Chillspaces not found");
        res.redirect("back");
      } else {
        //does user own this comment
        if (foundComment.author.id.equals(req.user._id)) {
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