const router = require("express").Router();
const Category = require("../models/Catagory"); // Ensure you have a Category model

// ✅ CREATE CATEGORY
router.post("/", async (req, res) => {
    const newCategory = new Category(req.body);
    try {
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ✅ GET ALL CATEGORIES
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ✅ DELETE CATEGORY
router.delete("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json("Category has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
