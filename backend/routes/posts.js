const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIMIE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIMIE_TYPE_MAP[file.mimetype];
  let error = new Error("Invalid mime type");
  if (isValid){
    error = null;
  }
  cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIMIE_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '_' + ext)
  }
})

router.post("", checkAuth, multer({storage: storage}).single("image"), (req,res,next)=>{
  if (!req.file) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  const url = req.protocol + '://' + req.get("host");
  const post=new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost=>{
    res.status(201).json({
      message:'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(() => {
    res.status(500).json({ message: "Creating a post failed" });
  });
});

router.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  if (!imagePath) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })
  Post.updateOne({_id: req.params.id}, post).then(() => {
    res.status(200).json({message:'Update successful!'});
  }).catch(() => {
    res.status(500).json({message: "Couldn't update post!"});
  });
});

router.get("",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;

  Post.find(pageSize, currentPage)
  .then((documents) => {
    fetchedPosts = documents;
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message:'Post fetched succesfully',
      posts:fetchedPosts,
      maxPosts: count
    });
  }).catch(() => {
    res.status(500).json({ message: "Fetching posts failed!" });
  });
});

router.get("/:id",(req,res,next)=>{
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else{
      res.status(404).json({message:"Post not found!"});
    }
  }).catch(() => {
    res.status(500).json({ message: "Fetching post failed!" });
  });
});

router.delete("/:id", checkAuth, (req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(result=>{
    if (!result.changes) {
      return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(200).json({message:"Post deleted"});
  }).catch(() => {
    res.status(500).json({message: "Deleting post failed"});
  });
});

module.exports = router;
