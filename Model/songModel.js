
const mongoose = require("mongoose");
const songSchema= require("../Schema/songSchema")
const songmodel = mongoose.model("song", songSchema);



module.exports = songmodel