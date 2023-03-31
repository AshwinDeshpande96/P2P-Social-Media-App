const { uploadToS3 } = require("../file/s3");
const Post = require("../../models/post");

// ########################################################################################
// ################################## ADD NEW POST ########################################
// ########################################################################################
async function addPost(req, res, next) {
  // const post = req.body;
  let imagePath = null;
  let _id = req.body.id;

  // ########################################################################################
  // PUSH FILE TO S3
  if (req.file) {
    try {
      const s3_location = "backend/images/" + _id;
      uploadToS3(req.file, s3_location);
      imagePath = s3_location + "/" + req.file.filename;
    } catch (err) {
      console.log(err);
    }
  }

  // ########################################################################################
  // CREATE POST
  const post = Post({
    _id: _id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
  });

  // ########################################################################################
  // SAVE POST TO MONGO-DB

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post added successfully",
        postId: _id,
      });
    })
    .catch((error) => {
      console.log(error);
      console.log("Save Post Failed!");
    });
  console.log(post);
}

// ########################################################################################
// ################################### UPDATE POST ########################################
// ########################################################################################
async function updatePost(req, res, next) {
  const _id = req.body.id;
  // ########################################################################################
  // CREATE UPDATED POST
  let post = Post({
    _id: _id,
    title: req.body.title,
    content: req.body.content,
  });

  // ########################################################################################
  // PUSH FILE TO S3
  if (req.file) {
    try {
      const s3_location = "backend/images/" + _id;
      uploadToS3(req.file, s3_location);
      imagePath = s3_location + "/" + req.file.filename;
      post["imagePath"] = imagePath;
    } catch (err) {
      console.log(err);
    }
  }

  // ########################################################################################
  // UPDATE POST IN MONGO-DB
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update Successful" });
  });
}

module.exports = { addPost, updatePost };
