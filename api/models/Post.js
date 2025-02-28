const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String, // URL of the post image
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array, // Array of category names
      required: false,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Post", PostSchema);
