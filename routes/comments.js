(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Post = mongoose.model("Post");
  var Comment = mongoose.model("Comment");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  router.route("/posts/:post/comments")
    .post(auth, function(req, res, next) {
      var comment = new Comment(req.body);
      comment.post = req.post;
      comment.upvotes = 1;
      comment.usersWhoUpvoted.push(req.payload._id);

      comment.save(function(err, comment) {
        if (err) {
          return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
          if (err) {
            return next(err);
          }

          Comment.populate(comment, {
            path: "author",
            select: "username"
          }).then(function(comment) {
            res.json(comment);
          });
        })
      })
    });

  router.route("/posts/:post/comments/:comment")
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.comment.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO better way to handle this?
      req.post.comments.splice(req.post.comments.indexOf(req.comment), 1);
      req.post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        req.comment.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

  router.route("/posts/:post/comments/:comment/upvote")
    .put(auth, function(req, res, next) {
      req.comment.upvote(req.payload, function(err, comment) {
        if (err) {
          return next(err);
        }

        Comment.populate(comment, {
          path: "author",
          select: "username"
        }).then(function(comment) {
          res.json(comment);
        });
      });
    });

  router.route("/posts/:post/comments/:comment/downvote")
    .put(auth, function(req, res, next) {
      req.comment.downvote(req.payload, function(err, comment) {
        if (err) {
          return next(err);
        }

        Comment.populate(comment, {
          path: "author",
          select: "username"
        }).then(function(comment) {
          res.json(comment);
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

  router.param("comment", function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
      if (err) {
        return next(err);
      }

      if (!comment) {
        return next(new Error("can't find comment"));
      }

      req.comment = comment;
      return next();
    });
  });

  module.exports = router;
})();
