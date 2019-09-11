var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
  address: {
      type: String,
      required: true,
  },
  admin:{
    type: Number,
    required: true
  }
});
var User = mongoose.model('User', UserSchema);
module.exports = User;


