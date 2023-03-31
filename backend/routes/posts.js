// Libraries
// --> Node.JS
const express = require("express");
const router = express.Router();
// --> File Manipulation

// Local
// --> WRITE
const { addPost, updatePost } = require("./write/posts.write");
const { multer, storage } = require("./file/posts.multer");

// --> READ
const {
  getPost,
  getPostImage,
  getAllPosts,
  getPostsBatch,
} = require("./read/posts.read");

// --> DELETE
const { deletePost, clearPosts } = require("./delete/posts.delete");

// ########################################################################################
// ####################################### WRITE ##########################################
// ########################################################################################

router.post("", multer({ storage: storage }).single("image"), addPost);

router.put("/:id", multer({ storage: storage }).single("image"), updatePost);

// ########################################################################################
// ####################################### READ ###########################################
// ########################################################################################

router.get("", getAllPosts);

router.get("/batch", getPostsBatch);

router.get("/:id", getPost);

router.get("/images/:id", getPostImage);

// ########################################################################################
// ##################################### DELETE ###########################################
// ########################################################################################

router.delete("/:id", deletePost);

router.delete("", clearPosts);

module.exports = router;
