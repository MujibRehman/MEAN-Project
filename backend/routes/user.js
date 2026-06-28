const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router()

router.post("/signup", async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const result = await user.save();

    res.status(201).json({
      message: "User Created",
      result: result,
    });
  } catch (err) {
    const statusCode = err && err.message && err.message.includes("UNIQUE")
      ? 409
      : 500;
    res.status(statusCode).json({
      error: err
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({email: req.body.email});

    if(!fetchedUser){
      return res.status(401).json({
        message: "Auth Failed"
      });
    }

    const result = await bcrypt.compare(req.body.password, fetchedUser.password);

    if(!result){
      return res.status(401).json({
        message: "Auth Failed"
      });
    }

    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_SECRET || 'dev_secret_change_me',
      {expiresIn: "1h" }
    );
    res.status(201).json({
      token: token,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed"
    });
  }
});

module.exports = router;
