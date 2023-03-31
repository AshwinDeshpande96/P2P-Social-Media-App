const { MIME_TYPE_MAP } = require("../write/posts.write_rules");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const postId = req.body.id;
    dir = "backend/images/" + postId;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, Date.now() + "." + ext);
  },
});

module.exports = { multer, storage };
