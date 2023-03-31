const { filterByKey, filterByKeys } = require("./posts.read_helper");
const { downloadFromS3 } = require("../file/s3");
const Post = require("../../models/post");

function getAllPosts(req, res, next) {
  Post.find().then((documents) => {
    // TODO: Send only permissible keys

    res.status(200).json({
      message: "Posts fetched success fully",
      posts: filterByKeys(documents),
    });
  });
}

function getPostsBatch(req, res, next) {
  let batch_size = req.query.batch_size;
  let start_index = req.query.start_index;
  Post.find()
    .sort({ updatedAt: -1 })
    .skip(start_index)
    .limit(batch_size)
    .then((documents) => {
      // TODO: Send only permissible keys

      res.status(200).json({
        message: "Posts fetched success fully",
        posts: filterByKeys(documents),
      });
    });
}

function getPost(req, res, next) {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      post = filterByKey(post);
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
}

function getPostImage(req, res, next) {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      const imagePath = post["imagePath"];
      console.log(post);
      if (imagePath) {
        const fileStream = downloadFromS3(
          process.env.AWS_S3_MEAN_BUCKET,
          imagePath
        );
        fileStream.pipe(res);
      } else {
        res.status(404).json({ message: "Image not in post" });
      }

      // res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
}
module.exports = { getPost, getPostImage, getAllPosts, getPostsBatch };
