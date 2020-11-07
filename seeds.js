var mongoose = require("mongoose");
var chillspaces = require("./models/chills");
var Comment = require("./models/comment");

var data = [
  {
    name: "evening chill",
    image: "beerchill.png",
    description: "A holiday is an opportunity to journey within. It is also a chance to chill, to relax. It is when I switch on my rest mode,I have self-doubt. I have insecurity. I have fear of failure. I have nights when I show up at the arena and I'm like, 'My back hurts, my feet hurt, my knees hurt. I don't have it. I just want to chill.' We all have self-doubt. You don't deny it, but you also don't capitulate to it. You embrace it."
  },
  {
    name: "group evening chill",
    image: "groupchill.png",
    description: "Keep your feet on the ground, but let your heart soar as high as it will. Refuse to be average or to surrender to the chill of your spiritual environment."
  },
  {
    name: "ever chill",
    image: "chills.jpg",
    description: "Sometimes you gotta just chill. You gotta chill your thinking process."
  }
]
function seedDB() {
  //Remove all chillspaces
  chillspaces.deleteMany({}, function (err) {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log("removed chillspaces!");
    //     Comment.remove({}, function (err) {
    //       if (err) {
    //         console.log(err);
    //       }
    //       console.log("removed comments!");
    //       //add a few chillspaces
    //       data.forEach(function (seed) {
    //         chillspaces.create(seed, function (err, chillspace) {
    //           if (err) {
    //             console.log(err)
    //           } else {
    //             console.log("added a chillspace");
    //             //create a comment
    //             Comment.create(
    //               {
    //                 text: "Place is great, but I wish there was internet",
    //                 author: "Homer"
    //               }, function (err, comment) {
    //                 if (err) {
    //                   console.log(err);
    //                 } else {
    //                   chillspace.comments.push(comment);
    //                   chillspace.save();
    //                   console.log("Created new comment");
    //                 }
    //               });
    //           }
    //         });
    //       });
    //     });
  });
}
module.exports = seedDB;


