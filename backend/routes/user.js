const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router()

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.passowrd, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      passowrd: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: "User Created",
        result: result,
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.find({email: req.body.email})
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "Auth Failed"
      });
    };
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "Auth Failed"
      });
    };
    const token = jwt.sign({email:user.email, userID: user_id}, 'secret_this_should_be_longer', {expiresIn: "1h" });
    res.status(201).json({
      token: token,
    });
  })
  .catch(err => {
    if(!result){
      return res.status(401).json({
        message: "Auth Failed"
      });
    };
  });
});

module.exports = router;
