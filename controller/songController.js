const express = require("express");
const customError = require("../CustomError");
const songmodel = require("../Model/songModel");
const artistmodel = require("../Model/artistModel");
const {authorized , adminauthorized} = require('../middleWare')
const mongoose = require("mongoose");


const addSong = async (req, res) => {
    try {
        const { artistid,catigory,title } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(artistid)) {
            next(
                customError({
                statusCode: 400,
                message: "Sorry, Invalid Artist ID",
                })
            );
        }
        const fineuser = await artistmodel.findById(artistid);
        if (!fineuser) {
            
            next(
                customError({
                statusCode: 404,
                message: "Artist not found",
                })
            );
        }

        const newSong = new songmodel({
            artistid,
            catigory,
            title
        });
        


        await newSong.save();
        
        res.status(200).send({newSong});
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        
}

};

const getAllSongs = async(req,res)=>{
    try {
        const list = await songmodel.find({});
        res.status(200).send(list);
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
            }
}

const getOneSong= async(req,res)=>{
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            
                customError({
                statusCode: 400,
                message: "Sorry, Invalid song ID",
                })
            
        }
    
        const findsong = await songmodel.findById(id);
        if (!findsong) {
                customError({
                statusCode: 404,
                message: "song not found",
                })
            
        }
        res.status(200).send({findsong})
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}


const edit = async ( req,res)=>{
    try {
     
        const {id, artistid, catigory,title} = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            
                customError({
                statusCode: 400,
                message: "Sorry, Invalid artist ID",
                })
            
        }
        const fineduser = await artistmodel.findById(id);
        if (!fineduser) {
                customError({
                statusCode: 404,
                message: "Artist not found",
                })
        
        }
        const editsong = await songmodel.findByIdAndUpdate(id, {
            artistid, 
            catigory,
            title
        });
    
        if (editsong) {
            console.log('Song Updated successfully');
            res.status(200).send("It is Updated");
        } else {
            next(
                customError({
                statusCode: 404,
                message: "song not found",
                })
            );
        }
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}

const del= async(req,res)=>{

    const { id } = req.body;

    songmodel.findByIdAndDelete(id)
    .then(() => {
    
    console.log('Song deleted successfully');
    res.status(200).send("deleted")
    })
    .catch(err => {
        console.error('Failed to delete song', err);
        res.status(201).send("Faild")
    });


}




module.exports={addSong,getAllSongs,getOneSong,edit,del}