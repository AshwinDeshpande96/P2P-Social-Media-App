const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
