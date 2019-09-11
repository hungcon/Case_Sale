var mongoose = require('mongoose');
var SaleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  image:{
    type: String,
    required: true
  }
});
var Sale = mongoose.model('Sale', SaleSchema);
module.exports = Sale;


