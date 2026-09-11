const Product = require("../models/product");
const Charity = require("../models/charity");
const Category = require("../models/category");
const { uploadToCloudinary } = require("../utils/cloudinary");

const allowedRoles = ["admin", "super-admin"];
const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

async function createProduct(req, res) {
  try {
    const {title,short_description,long_description,charity_id,category_id,quantity,price,discount = 0} = req.body;

    const user = req.user;

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Access denied"
      });
    }

    const charity = await Charity.findById(charity_id);
    if (!charity || (user.role === "admin" && charity.user_id.toString() !== user._id.toString())) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid charity" 
      });
    }

    const category = await Category.findById(category_id);
    if (!category || (user.role === "admin" && category.user_id.toString() !== user._id.toString())) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid category" 
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Product image is required" 
      });
    }

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid image format" 
      });
    }

    if (req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Image must be ≤ 1MB" 
      });
    }

    const imageURL = await uploadToCloudinary(req.file.buffer);
    
    const product = await Product.create({title,short_description,long_description,user_id: user._id,charity_id,category_id,quantity: Number(quantity),price: Number(price),discount: Number(discount),image: imageURL});

    return res.status(201).json({
      status: "Success",
      message: "Product created successfully",
      data: product
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find()
      .populate("charity_id", "name")
      .populate("category_id", "title");
      
    res.status(200).json({
      status: "Success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate("charity_id", "name")
      .populate("category_id", "title");

    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
    });
  }
}

async function getProductsByCharityForAdmin(req, res) {
  try {
    const { id: charity_id } = req.params;
    const { _id, role } = req.user;

    const charity = await Charity.findById(charity_id);
    if (!charity) {
      return res.status(404).json({
        status: "Failed",
        message: "Charity not found",
      });
    }

    if (role === "admin" && charity.user_id.toString() !== _id.toString()) {
      return res.status(403).json({
        status: "Failed",
        message: "Access denied. Not the owner of this charity.",
      });
    }

    const products = await Product.find({ charity_id })
      .populate("category_id", "title");

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products by charity ID for admin:", err);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
    });
  }
}

async function getProductsByCharityPublic(req, res) {
  try {
    const { id: charity_id } = req.params;
    const charity = await Charity.findById(charity_id);
    
    if (!charity) {
      return res.status(404).json({
        status: "Failed",
        message: "Charity not found",
      });
    }

    const products = await Product.find({ charity_id, status: "active" })
      .populate("category_id", "title");

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products for public:", err);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
    });
  }
}

async function getProductsByCategory(req, res) {
  try {
    const { id: category_id } = req.params;
    const category = await Category.findById(category_id);
    
    if (!category) {
      return res.status(404).json({
        status: "Failed",
        message: "Category not found",
      });
    }

    const products = await Product.find({ category_id, status: "active" })
      .populate("charity_id", "name");

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
    });
  }
}

async function updateProductStatus(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    const { status } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        status: "Failed", 
        message: "Product not found" 
      });
    }

    if (user.role === "admin" && product.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Access denied" 
      });
    }

    product.status = status;
    await product.save();

    res.status(200).json({ 
      status: "Success", 
      message: "Status updated", 
      data: product 
    });

  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ 
      status: "Failed", 
      message: "Server error" 
    });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const user = req.user;
    const updateData = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found"
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Access denied"
      });
    }
    
    if (user.role === "admin" && product.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Access denied" 
      });
    }

    let imageURL = product.image;
    if (req.file && req.file.buffer) {
      if (!allowedImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          status: "Failed", 
          message: "Invalid image format" 
        });
      }

      if (req.file.size > MAX_IMAGE_SIZE) {
        return res.status(400).json({ 
          status: "Failed", 
          message: "Image must be ≤ 1MB" 
        });
      }

      imageURL = await uploadToCloudinary(req.file.buffer);
    }

    const updatedFields = {
      title: updateData.title || product.title,
      short_description: updateData.short_description || product.short_description,
      long_description: updateData.long_description || product.long_description,
      quantity: updateData.quantity ? Number(updateData.quantity) : product.quantity,
      price: updateData.price ? Number(updateData.price) : product.price,
      discount: updateData.discount ? Number(updateData.discount) : product.discount,
      status: updateData.status || product.status,
      image: imageURL
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "Failed",
      message: err.message
    });
  }
}

module.exports = { 
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCharityForAdmin,
  getProductsByCharityPublic,
  getProductsByCategory,
  updateProductStatus,
  updateProduct
};