(function() {
  "use strict";
  
  var app = angular.module("flapper-news.controllers.auth", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("login", {
          parent: "root",
          url: "/login",
          views: {
            "container@": {
              templateUrl: "partials/login",
              controller: "AuthController"
            }
          },
          onEnter: [
            "$state",
            "authService",
            function($state, authService) {
              if (authService.isLoggedIn()) {
                $state.go("home");
              }
            }
          ]
        })
        .state("register", {
          parent: "root",
          url: "/register",
          views: {
            "container@": {
              templateUrl: "partials/register",
              controller: "AuthController"
            }
          },
          onEnter: [
            "$state",
            "authService",
            function($state, authService) {
              if (authService.isLoggedIn()) {
                $state.go("home");
              }
            }
          ]
        });
    }
  ]);

  app.controller("AuthController", [
    "$scope",
    "$state",
    "authService",
    function($scope, $state, authService) {
      $scope.user = {};

      function register() {
        authService.register($scope.user).error(function(error) {
          $scope.error = error;
        }).then(function() {
          $state.go("home");
        });
      }

      function logIn() {
        authService.logIn($scope.user).error(function(error) {
          $scope.error = error;
        }).then(function() {
          $state.go("home");
        });
      }

      $scope.register = register;
      $scope.logIn = logIn;
    }
  ]);
})();
