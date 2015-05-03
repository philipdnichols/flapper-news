(function() {
  "use strict";
  
  var app = angular.module("flapper-news.controllers.main", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("home", {
        parent: "root",
        url: "/home",
        views: {
          "container@": {
            templateUrl: "partials/home",
            controller: "MainController"
          }
        },
        resolve: {
          getPostsPromise: [
            "postService",
            function(postService) {
              return postService.getAll();
            }
          ]
        }
      });
    }
  ]);

  app.controller("MainController", [
    "$scope",
    "postService",
    "authService",
    function($scope, postService, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.posts = postService.posts;

      $scope.shouldShowAddNewPostForm = false;

      function addPost() {
        if (!$scope.title || $scope.title === "") {
          return;
        }

        postService.create({
          title: $scope.title,
          link: $scope.link,
          author: authService.currentUserId()
        });

        $scope.title = "";
        $scope.link = "";
        $scope.shouldShowAddNewPostForm = false;
      }

      function deletePost(post) {
        // TODO add modal confirmation
        postService.deletePost(post);
      }

      function incrementUpvotes(post) {
        postService.upvote(post);
      }

      function incrementDownvotes(post) {
        postService.downvote(post);
      }

      function getUpvoteColor(post) {
        if (post.upvoteHover || isUpvotedByCurrentUser(post)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(post) {
        if (post.downvoteHover || isDownvotedByCurrentUser(post)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(post) {
        return post.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(post) {
        return post.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewPostForm() {
        $scope.shouldShowAddNewPostForm = true;
      }

      function hideAddNewPostForm() {
        $scope.shouldShowAddNewPostForm = false;
        $scope.title = "";
        $scope.link = "";
      }

      function showDeletePost(post) {
        return post.author._id == authService.currentUserId();
      }

      $scope.addPost = addPost;
      $scope.deletePost = deletePost;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewPostForm = showAddNewPostForm;
      $scope.hideAddNewPostForm = hideAddNewPostForm;
      $scope.showDeletePost = showDeletePost
    }
  ]);
})();
