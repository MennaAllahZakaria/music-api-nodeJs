const express = require("express");
const router = express.Router();
const { authorized, adminauthorized,tokenauthorized} = require('../middleWare')
const {addSong,getAllSongs,getOneSong,edit,del } = require('../controller/songController')



router.post("/",addSong);

router.get("/",getAllSongs);

router.get("/get/:id",getOneSong);

router.patch("/",adminauthorized,edit);

router.delete("/",adminauthorized,del);

module.exports = router;