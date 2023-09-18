const express = require("express");
const customError = require("../CustomError");
const albummodel= require("../Model/albumModel");
const songmodel = require("../Model/songModel");
const artistmodel = require("../Model/artistModel");
const mongoose = require("mongoose");


const addAlbum = async (req, res) => {
    try {
        const { artistid,songid,title } = req.body;
        

        const finduser = await artistmodel.findById(artistid);
        if (!finduser) {
            next(
                customError({
                statusCode: 404,
                message: "Artist not found",
                })
            );
        }
        
        const findsong = await songmodel.findById(songid);
        if (!findsong) {
            
            next(
                customError({
                statusCode: 404,
                message: "song not found",
                })
            );
        }

        const newAlbum = new albummodel({
            title,
            artistid,
            songs:findsong
        });
        


        await newAlbum.save();
       
        finduser.albums.push({newAlbum});
        await finduser.save();
        res.status(200).send({newAlbum});
    } catch (error) {
        res.status(500).send(customError({
            statusCode:400,
            message:"can\'t add Album"
        }))
        
}

};


const getAllAlbum = async(req,res)=>{
    try {
        const list = await albummodel.find({});
        res.status(200).send(list);
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
            }
}
const getOneAlbum= async(req,res)=>{
    try {
        const { id } =  req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(
                customError({
                statusCode: 400,
                message: "Sorry, Invalid album ID",
                })
            );
        }
    
        const findAlbum = await albummodel.findById(id);
        if (findAlbum) {
            res.send(findAlbum);
        } else {
            next(
                customError({
                statusCode: 404,
                message: "Album not found",
                })
            );
        }
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}

const editTitle=async(req,res)=>{
    try {
        const { id ,title} = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(
                customError({
                statusCode: 400,
                message: "Sorry, Invalid artist ID",
                })
            );
        }
    
        const ediAlbum = await albummodel.findByIdAndUpdate(id, {
            title
        });
    
        if (ediAlbum) {
            console.log('Album title Updated successfully');
            await ediAlbum.save();
            res.status(200).send("It is Updated");
        } else {
            next(
                customError({
                statusCode: 404,
                message: "album not found",
                })
            );
        }
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}
const addSongs=async( req,res)=>{
try{
    const {albumid,songid}=req.body;

    const album=await albummodel.findById(albumid);
    const song = await songmodel.findById(songid);

    if (!album) {
        res.status(404).json({ message: 'album not found' });
    }
    
    if (!song) {
    res.status(404).json({ message: 'song not found' });
    }

    album.songs.push({song});
    await album.save();

    return res.status(200).json({ message: 'song added to album successfully' });



}catch(error){
    res.status(error.status || 500).send({ error: error.message });

}
}

const del= async(req,res)=>{

    const { id } = req.body;

    albummodel.findByIdAndDelete(id)
    .then(() => {
    
    console.log('Album deleted successfully');
    
    res.status(200).send("deleted")
    })
    .catch(err => {
        console.error('Failed to delete Album', err);
        res.status(201).send("Faild")
    });


}




module.exports={addAlbum,getAllAlbum,getOneAlbum,addSongs,del}