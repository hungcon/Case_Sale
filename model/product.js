var mongoose = require('mongoose');
var ProductSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  productImages:{
    type: String,
    required: true
  },
  productPrice:{
    type: String,
    required: true
  },
  productInfo:{
    type: String,
    required: true
  },
  color:{
    type: String,
    required: true
  }
});
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
