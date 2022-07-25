const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log(`MongoDB connected`)
}).catch((err)=>{
    console.log(`MongoDB not connected ${err}`)
});