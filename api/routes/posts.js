const router = require("express").Router();
const Post = require("../models/Post");

// ✅ CREATE POST
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found ❌");

    if (post.username === req.body.username) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } else {
      res.status(401).json("You can update only your post! ❌");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found ❌");

    if (post.username === req.body.username) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("Post has been deleted ✅");
    } else {
      res.status(401).json("You can delete only your post! ❌");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found ❌");

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user; // Get username from query parameters
  const catName = req.query.cat; // Get category from query parameters
  const searchQuery = req.query.query; // Get search query for title

  try {
    let posts;
    if (searchQuery) {
      // Search posts by title using a case-insensitive regex
      posts = await Post.find({
        title: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
      });
    } else if (username) {
      // Get posts by a specific user
      posts = await Post.find({ username });
    } else if (catName) {
      // Get posts by a specific category
      posts = await Post.find({
           categories: {
             $in: [catName],
          },
      });
    } else {
      // If no filter is provided, return all posts
      posts = await Post.find();
    }
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

  

module.exports = router;
