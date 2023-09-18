const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const util = require('util');
const asyncSign = util.promisify(jwt.sign);
const { type } = require('os');

// artist id -  songs - 
const albumSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  artistid: {
    type: String,
    required: true,
    
    trim: true,
    
    },
    songs:[]



});


module.exports = albumSchema;