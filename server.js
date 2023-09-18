require('./db')
const express = require("express");
const app = express();
const port = 5000;

const artistRouter=require("./Routers/artistRouter");
const albumRouter=require("./Routers/albumRouter");
const songRouter=require("./Routers/songRouter");

app.use(express.json());
app.use(['/artist' , "/artists"], artistRouter);
app.use(['/album',"/albums"], albumRouter);
app.use(['/song','/songs'], songRouter);


app.use((err , req ,res ,next)=>{
    res.status(err.status).send({
        message : err.message
    })
})


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
  