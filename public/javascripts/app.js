(function() {
  "use strict";
  
  var app = angular.module("flapper-news", [
    "flapper-news.controllers.main",
    "flapper-news.controllers.post",
    "flapper-news.controllers.auth",
    "flapper-news.controllers.nav",
    "flapper-news.services.post",
    "flapper-news.services.auth",
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state("root", {
        abstract: true,
        views: {
          "header": {
            templateUrl: "partials/header",
            controller: "NavController"
          }
        }
      });

      $urlRouterProvider.otherwise("home");
    }
  ]);
})();
