const express = require("express");
const router = express.Router();
const customError = require("../CustomError");


const { authorized, adminauthorized,tokenauthorized} = require('../middleWare')
const { addAlbum,getAllAlbum,getOneAlbum,addSongs,del } = require('../controller/albumController')



router.post("/",authorized,addAlbum);

router.get("/",getAllAlbum);

router.get("/get/:id",getOneAlbum);

router.patch("/",adminauthorized,addSongs);

router.delete("/",adminauthorized,del);


module.exports = router;