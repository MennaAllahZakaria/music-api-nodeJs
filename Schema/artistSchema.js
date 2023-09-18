const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const asyncSign = util.promisify(jwt.sign);
const secretKey = 'kkkk';
const validator = require('validator');
const { type } = require('os');
// first name - last name - user name - password - email - phone number - address - isadmin
const artistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,

  },
  phonenumber: {
    type: String,
    required: true,
    trim: true,

  },
  address: {
    type: String,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  albums:[]
 


});

artistSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
  }
});

artistSchema.methods.generateToken = function () {
  const token = asyncSign(
    {
      id: this.id,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    secretKey
  );
  return token;
};

module.exports = artistSchema;