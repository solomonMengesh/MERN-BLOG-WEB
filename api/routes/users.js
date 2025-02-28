const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");

// UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {  // Check if the user is updating their own account
      if (req.body.password) {  // Check if the password is being updated
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
  
      try {
        // Update the user and return the updated document
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,  // Set the new values
        }, { new: true });  // Return the updated document
  
        res.status(200).json(updatedUser);  // Return the updated user
  
      } catch (err) {
        res.status(500).json(err);  // Handle errors
      }
    } else {
      res.status(401).json("You can update only your account!");  // Unauthorized if user is trying to update someone else's account
    }
  });
  
  
  // DELETE USER
  router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json("User not found! ❌");
        }
  
        // Delete all posts associated with the user
        await Post.deleteMany({ username: user.username });
  
        // Delete user
        await User.findByIdAndDelete(req.params.id);
  
        res.status(200).json("User has been deleted successfully! ✅");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your account! ❌");
    }
  });
  
// GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json("User not found ");
        }

        // Exclude the password before sending the response
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

  
module.exports = router;
