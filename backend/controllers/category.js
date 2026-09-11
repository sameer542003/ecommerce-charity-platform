const Category = require("../models/category");
const { uploadToCloudinary } = require("../utils/cloudinary");

const allowedRoles = ["admin", "super-admin"];
const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

async function createCategory(req, res) {
  try {
    const { title } = req.body;

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "Failed",
        message: "Only admin and super-admin can create categories"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "Failed",
        message: "Image is required"
      });
    }

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: "Failed", 
        message: "Invalid image format. Only JPG/JPEG/PNG allowed"
      });
    }

    if (req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        status: "Failed",
        message: "Image size must be less than 1MB"
      });
    }

    const imageURL = await uploadToCloudinary(req.file.buffer);
    const newCategory = await Category.create({
      title,
      image: imageURL,
      user_id: req.user._id
    });

    res.status(201).json({
      status: "Success",
      message: "Category created successfully",
      data: newCategory
    });

  } catch (err) {
    res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
}

async function getCategoriesForAdmin(req, res) {
  try {
    let categories;

    if (req.user.role === "super-admin") {
      categories = await Category.find({});
    } else {
      categories = await Category.find({ user_id: req.user._id });
    }

    res.status(200).json({
      status: "Success",
      count: categories.length,
      data: categories
    });

  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message
    });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await Category.find({}).select("title image");
    res.status(200).json({
      status: "Success",
      count: categories.length,
      data: categories
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message
    });
  }
}

async function updateCategoryTitle(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "Failed",
        message: "Category not found"
      });
    }

    const isOwner = category.user_id.toString() === req.user._id.toString();
    const isSuperAdmin = req.user.role === "super-admin";

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({
        status: "Failed",
        message: "You can only update your own categories"
      });
    }

    category.title = title;
    await category.save();

    res.status(200).json({
      status: "Success",
      message: "Category title updated successfully",
      data: category
    });

  } catch (err) {
    res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
}

module.exports = {
  createCategory,         
  getCategoriesForAdmin,  
  getAllCategories,      
  updateCategoryTitle    
};