const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());


dotenv.config({path: './config.env'});
require('./db/conn.js');
app.use(express.json());
app.use(require('./routes/auth'));


const PORT = process.env.PORT || PORT;


// app.get('/',(req,res)=>{
//     res.send('hello form home page')
// })

// app.get('/about', middleware, (req,res)=>{
//     res.send('hello form about page')
// })

// app.get('/contact',(req,res)=>{
//     res.cookie('test', '1&142a');
//     res.send('hello world from contact page')
// })

// app.get('/signin',(req,res)=>{
//     res.send('hello world from signin page')
// })

app.get('/signup',(req,res)=>{
    res.send('hello world from signup page')
})








app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})