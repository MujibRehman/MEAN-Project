const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
const path=require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

var cors = require('cors')

const { createShorthandPropertyAssignment } = require('typescript');

const app=express();

mongoose.connect("mongodb+srv://admin:123@cluster0.5a8uy.mongodb.net/")
.then(()=>{
  console.log("Connected to database");
})
.catch(()=>{
    console.log("Connection to database failed");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")))
app.use(cors())

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Method",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
