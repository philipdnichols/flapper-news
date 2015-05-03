(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Post = mongoose.model("Post");
  var Comment = mongoose.model("Comment");
  var User = mongoose.model("User");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.route("/posts")
    .get(function(req, res, next) {
      Post.find(function(err, posts) {
        if (err) {
          return next(err);
        }

        // Load the author objects, but only the id and username, for security reasons
        Post.populate(posts, {
          path: "author",
          select: "username"
        }).then(function(posts) {
          res.json(posts);
        });
      });
    })
    .post(auth, function(req, res, next) {
      var post = new Post(req.body);
      post.upvotes = 1;
      post.usersWhoUpvoted.push(req.payload._id);

      post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

  // TODO error handling on these populate promises
  router.route("/posts/:post")
    .get(function(req, res, next) {
      Post.populate(req.post, {
        path: "comments",
      }).then(function(post) {
        Comment.populate(req.post.comments, {
          path: "author",
          select: "username"
        }).then(function(comments) {
          res.json(post);
        });
      });
    })
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.post.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO: I wonder if there is a way to define a cascade strategy
      Comment.remove({ post: req.post }, function(err) {
        if (err) {
          return next(err);
        }

        req.post.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

  router.route("/posts/:post/upvote")
    .put(auth, function(req, res, next) {
      req.post.upvote(req.payload, function(err, post) {
        if (err) {
          return next(err);
        }

        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

  router.route("/posts/:post/downvote")
    .put(auth, function(req, res, next) {
      req.post.downvote(req.payload, function(err, post) {
        if (err) {
          return next(err);
        }

        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

  router.param("post", function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }

      if (!post) {
        return next(new Error("can't find post"));
      }

      req.post = post;
      return next();
    });
  });

  module.exports = router;
})();
