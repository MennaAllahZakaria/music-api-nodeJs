
const mongoose = require("mongoose");
const artistSchema= require("../Schema/artistSchema")
const artistmodel = mongoose.model("artist", artistSchema);



module.exports = artistmodel