(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  router.route("/partials/:name")
    .get(function(req, res, next) {
      res.render("partials/" + req.params.name, {
        title: "Express"
      });
    });

  // router.param("name", function(req, res, next, id) {
  //   req.name = id;
  //   return next();
  // });

  module.exports = router;
})();
