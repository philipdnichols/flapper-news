var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  upvotedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  downvotedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  upvotedComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  downvotedComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  hash: String,
  salt: String
});

// TODO upvotedPosts,downvotedPosts,upvotedComments,downvotedComments not used

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, "SECRET"); // TODO this should be setup as an ENV variable as should be kept out of the codebase
};

mongoose.model("User", UserSchema);
