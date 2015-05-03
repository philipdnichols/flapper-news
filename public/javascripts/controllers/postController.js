(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.post", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("post", {
        parent: "root",
        url: "/posts/{id}",
        views: {
          "container@": {
            templateUrl: "partials/post",
            controller: "PostController"
          }
        },
        resolve: {
          post: [
            "$stateParams",
            "postService",
            function($stateParams, postService) {
              return postService.get($stateParams.id);
            }
          ]
        }
      });
    }
  ]);

  app.controller("PostController", [
    "$scope",
    "postService",
    "post",
    "authService",
    function($scope, postService, post, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.post = post;

      $scope.shouldShowAddNewCommentForm = false;

      function addComment() {
        if ($scope.body === '') {
          return;
        }

        postService.addComment(post._id, {
          body: $scope.body,
          author: authService.currentUserId()
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });

        $scope.body = "";
        $scope.shouldShowAddNewCommentForm = false;
      }

      function incrementUpvotes(comment) {
        postService.upvoteComment(post, comment);
      }

      function incrementDownvotes(comment) {
        postService.downvoteComment(post, comment);
      }

      function deleteComment(comment) {
        // TODO add modal confirmation
        postService.deleteComment(post, comment)
          .success(function() {
            post.comments.splice(post.comments.indexOf(comment), 1);
          });
      }

      function getUpvoteColor(comment) {
        if (comment.upvoteHover || isUpvotedByCurrentUser(comment)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(comment) {
        if (comment.downvoteHover || isDownvotedByCurrentUser(comment)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(comment) {
        return comment.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(comment) {
        return comment.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewCommentForm() {
        $scope.shouldShowAddNewCommentForm = true;
      }

      function hideAddNewCommentForm() {
        $scope.shouldShowAddNewCommentForm = false;
        $scope.body = "";
      }

      function showDeleteComment(comment) {
        return comment.author._id == authService.currentUserId();
      }

      $scope.addComment = addComment;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.deleteComment = deleteComment;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewCommentForm = showAddNewCommentForm;
      $scope.hideAddNewCommentForm = hideAddNewCommentForm;
      $scope.showDeleteComment = showDeleteComment;
    }
  ]);
})();
