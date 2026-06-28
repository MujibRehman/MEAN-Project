const express=require('express');
const bodyParser=require('body-parser');
const path=require("path");
const db = require("./database");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

var cors = require('cors')

const app=express();

db.initializeDatabase()
  .then(() => {
    console.log(`Connected to SQLite database at ${db.databasePath}`);
  })
  .catch((error) => {
    console.log("Connection to database failed");
    console.error(error.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")))
app.use(cors())

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
