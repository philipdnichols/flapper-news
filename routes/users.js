(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var User = mongoose.model("User");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });

  // TODO this is probably an issue sending salts and such over the network?
  router.route("/users")
    .get(auth, function(request, response, next) {
      User.find(function(err, users) {
        if (err) {
          return next(err);
        }

        response.json(users);
      });
    });

  router.route("/users/:user")
    .get(auth, function(request, response, next) {
      response.json(request.user);
    });

  router.param("user", function(request, response, next, id) {
    var query = User.findById(id);

    query.exec(function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new Error("can't find user"));
      }

      request.user = user;
      return next();
    });
  });

  module.exports = router;
})();
