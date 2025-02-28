const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user to the database
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN - Find by Username
router.post("/login", async (req, res) => {
    try {
      // Find user by username
      const user = await User.findOne({
        username: { $regex: new RegExp("^" + req.body.username + "$", "i") },
      });
      if (!user) {
        return res.status(404).json("User not found! ❌");
      }
  
      // Compare entered password with hashed password in DB
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json("Invalid password! ❌");
      }
  
      // Destructure password and return other fields
      const { password, ...others } = user._doc;
  
      // Send response without password
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router;
