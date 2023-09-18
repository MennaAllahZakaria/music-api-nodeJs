const express = require("express");
const router = express.Router();

const { authorized, adminauthorized,tokenauthorized} = require('../middleWare')
const {signup,getAllArtists,getOneArtist,login,edit,del } = require('../controller/artistController')


router.post("/",signup);

router.post("/login",login)

router.get("/",adminauthorized,getAllArtists);

router.get("/get/:id",authorized,getOneArtist);

router.patch("/",authorized,edit);

router.delete("/",authorized,del);

module.exports = router;