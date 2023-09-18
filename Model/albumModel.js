
const mongoose = require("mongoose");
const albumSchema= require("../Schema/albumSchema")
const albummodel = mongoose.model("album", albumSchema);



module.exports = albummodel