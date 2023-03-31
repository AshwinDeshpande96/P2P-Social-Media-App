const Post = require("../../models/post");
const { emptyS3Directory } = require("../file/s3");
function deletePost(req, res, next) {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((res) => {
    console.log(res);
  });
  res.status(200).json({
    message: "Post Deleted",
  });
}

function clearPosts(req, res, next) {
  Post.deleteMany({}).then((res) => {
    console.log(res);
    // emptyS3Directory(process.env.AWS_S3_MEAN_BUCKET, "backend/images");
  });
  res.status(200).json({
    message: "All Posts Deleted",
  });
}
module.exports = { deletePost, clearPosts };
