const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
   user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;