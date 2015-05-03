(function() {
  "use strict";
  
  var app = angular.module("flapper-news.services.post", []);

  app.factory("postService", [
    "$http",
    "authService",
    function($http, authService) {
      var o = {
        posts: []
      };

      function getAll() {
        return $http.get("/posts").then(function(response) {
          angular.copy(response.data, o.posts);
        });
      }

      function get(id) {
        return $http.get("/posts/" + id).then(function(response) {
          return response.data;
        });
      }

      function create(post) {
        return $http.post("/posts", post, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(savedPost) {
          o.posts.push(savedPost);
        });
      }

      function deletePost(post) {
        return $http.delete("/posts/" + post._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function() {
          o.posts.splice(o.posts.indexOf(post), 1);
        });
      }

      function upvote(post) {
        return $http.put("/posts/" + post._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedPost) {
          angular.copy(upvotedPost, post);
        });
      }

      function downvote(post) {
        return $http.put("/posts/" + post._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedPost) {
          angular.copy(downvotedPost, post);
        });
      }

      function addComment(id, comment) {
        return $http.post("/posts/" + id + "/comments", comment, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        });
      }

      function upvoteComment(post, comment) {
        return $http.put("/posts/" + post._id + "/comments/" + comment._id + "/upvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(upvotedComment) {
          // TODO should code like this be in the controller or the service?
          angular.copy(upvotedComment, comment);
        });
      }

      function downvoteComment(post, comment) {
        return $http.put("/posts/" + post._id + "/comments/" + comment._id + "/downvote", null, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        }).success(function(downvotedComment) {
          angular.copy(downvotedComment, comment);
        });
      }

      function deleteComment(post, comment) {
        return $http.delete("/posts/" + post._id + "/comments/" + comment._id, {
          headers: {
            Authorization: "Bearer " + authService.getToken()
          }
        });
      }

      o.getAll = getAll;
      o.get = get;
      o.create = create;
      o.deletePost = deletePost;
      o.upvote = upvote;
      o.downvote = downvote;
      o.addComment = addComment;
      o.upvoteComment = upvoteComment;
      o.downvoteComment = downvoteComment;
      o.deleteComment = deleteComment;

      return o;
    }
  ]);
})();
