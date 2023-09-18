const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const asyncSign = util.promisify(jwt.sign);
const secretKey = 'kkkk';
const validator = require('validator');
const { type } = require('os');
// artist id - catigory - ملحن - كاتب 
const songSchema = new mongoose.Schema({
    artistid: {
    type: String,
    required: true,
    trim: true,
    },
    catigory: {
    type: String,
    required: true,
    trim: true,
    },
    title:{
    type: String,
    required: true,
    
    }




});

module.exports = songSchema;