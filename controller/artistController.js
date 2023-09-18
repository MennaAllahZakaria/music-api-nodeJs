const express = require("express");
const router = express.Router();
const customError = require("../CustomError");
const artistmodel = require("../Model/artistModel");
const bcrypt = require('bcrypt')
const {authorized , adminauthorized} = require('../middleWare')
const validator = require('validator');
const mongoose = require("mongoose");


function isStrongPassword(password) {
    // Validate password length
    if (!validator.isLength(password, { min: 8 })) { 
        return false;
    }
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:<>|./?])(?!.*\s).{8,}$/;
    if (!validator.matches(password, passwordRegex)) {
    return false;
    }
    // Additional checks
    if (validator.isLowercase(password) || validator.isUppercase(password) || validator.isNumeric(password)) {
    return false;
    }
    return true;
}


const signup = async (req, res) => {
    try {
        const { email, firstname, lastname, username, password, phonenumber, address, isAdmin } = req.body;
        
        // Validate Email
        
        if ( !validator.isEmail(email)){
            return res.status( 400).json({
                message: 'Email format is not correct',
                code: 400
            })
        }
        // Validate Length of first name
        if ( !validator.isLength(firstname,{ min: 3, max: 20 })){
            return  res.status( 400).json({
                message: 'your first name format is not valid',
                code: 400
            })
        }
        // Validate Length of last name
        if ( !validator.isLength(lastname,{ min: 3, max: 20 })){
            returnres.status( 400).json({
                message: 'your last name format is not valid',
                code: 400
                })
        }
        // Validate Mobile Phone
        if ( !validator.isMobilePhone(phonenumber, 'ar-EG')){
            return res.status( 400).json({
                message: 'your phone number format is not valid',
                code: 400
                })
        }
        


        
     // Validate password 
        if (!isStrongPassword(password)) {
            return res.status( 400).json({
                message: 'Your password is not valid \n Password length should be more than 8 char and should contain at least one lowercase letter, one uppercase letter, and one digit',
                code: 400
                })
        }

        

        const hashedPassword = await bcrypt.hash(password, 10);


        const newArtist = new artistmodel({
            email, 
            firstname,
            lastname,
            username,
            password:hashedPassword,
            phonenumber,
            address,
            isAdmin,
            albums:[],
        });
        


        await newArtist.save();
        const token = await newArtist.generateToken();
        res.status(200).send({newArtist,token});
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message })
        
}

};

const getAllArtists = async(req,res)=>{
    try {
        const list = await artistmodel.find({});
        res.status(200).send(list);
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
            }
}

const getOneArtist= async(req,res)=>{
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            
                customError({
                statusCode: 400,
                message: "Sorry, Invalid Artist ID",
                })
            
        }
    
        const finduser = await artistmodel.findById(id);
        if (finduser) {
            res.send(finduser);
        } else {
            
                customError({
                statusCode: 404,
                message: "Artist not found",
                })
            ;
        }
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}


const login = async (req, res) => {
    try {
      const { id, username, password } = req.body;
      const artist = await artistmodel.findById(id);
  
      if (!artist) {
        throw customError({
          statusCode: 401,
          message: 'user name or password is not correct'
        });
      }
  
      const comparePass = await bcrypt.compare(password, artist.password);
      //res.status(200).send({ comparePass });
      if (comparePass) {
        const token = await artist.generateToken();
        res.status(200).send({ token });
      } else {
        throw customError({
          statusCode: 401,
          message: 'user name or password is not correct'
        });
      }
    } catch (error) {
      res.status(404).send({ error: 'Error logging in' });
    }
  };

const edit = async ( req,res)=>{
    try {
        const { id } = req.params;
        const { firstname, lastname,email,username,password, phoneNumber,address, isAdmin } = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(
                customError({
                statusCode: 400,
                message: "Sorry, Invalid artist ID",
                })
            );
        }
    
        const editartist = await artistmodel.findByIdAndUpdate(id, {
            firstname,
            lastname,
            email,
            username,
            password,
            phoneNumber,
            address, 
            isAdmin
        });
    
        if (editartist) {
            console.log('Artist Updated successfully');
            res.status(200).send("It is Updated");
        } else {
            next(
                customError({
                statusCode: 404,
                message: "artist not found",
                })
            );
        }
        } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
        }
}

const del= async(req,res)=>{

    const { id } = req.body;

    artistmodel.findByIdAndDelete(id)
    .then(() => {
    
    console.log('Artist deleted successfully');
    res.status(200).send("deleted")
    })
    .catch(err => {
        console.error('Failed to delete Artist', err);
        res.status(201).send("Faild")
    });


}




module.exports={signup,getAllArtists,getOneArtist,login,edit,del}