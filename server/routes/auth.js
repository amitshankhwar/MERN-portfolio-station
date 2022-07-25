const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authentication = require('../middleware/authentication')




require('../db/conn');
const User = require('../models/userSchema');


router.get('/',(req,res)=>{
    res.send('hello form home page')
})

//USING ASYNC-AWAIT ---

router.post('/register', async(req,res)=>{

    const {name, email, phone, work, password, cpassword} = req.body;
    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({status:422, error:'fill all the credentials properly!!'})
    }
    
    try {

        const userExist = await User.findOne({email: email})

        if(userExist){
            return res.status(422).json({status:422, error:'User already exist!!'});
        }
        else if(password != cpassword){
            return res.status(422).json({status:422, error:'Password must be same!!'});
        }
        else{

            const user = new User({name, email, phone, work, password, cpassword});
            //hashing middleware executed here--
            await user.save();
    
            res.status(201).json({msg:'user registered successfully!!'});
        }
    }catch (error) {
        console.log(error)
    }
 
 })

 //Login route---

 router.post('/signin', async(req,res)=>{

        try {
            const {email,password} = req.body;
            if(!email || !password){
                return res.status(400).json({status:400, error:'fill all the credentials properly!!'});
            }

            const userLogin = await User.findOne({email: email});

            if (userLogin) {
                //camparing hashed password
                const isMatched = await bcrypt.compare(password, userLogin.password);

                const token = await userLogin.generateAuthToken();
                console.log(token);

                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                
                if(!isMatched){
                    res.status(400).json({status:400,msg:"Invalid credentials!!"})
                }else{
                    res.json({err:"user login successfully!!"})
                }
            } 
            else {
                res.status(400).json({status:400, msg:"Invalid credentials!!"})
            }
           

        } catch (error) {
            console.log(error);
        }
 })

 //USING PROMISES---

// router.post('/register',(req,res)=>{

//    const {name, email, phone, work, password, cpassword} = req.body;
   
//    if(!name || !email || !phone || !work || !password || !cpassword){
//        return res.status(422).json({error:'fill all the credentials properly!!'})
//    }

//    User.findOne({email: email})
//    .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:'User already exist!!'})
//         }

//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(()=>{
//             return res.status(201).json({msg:'user registered successfully!!'});
//         }).catch(()=>{
//             return res.status(500).json({error:'Failed to registered!!'});
//         })
//    }).catch(err=>console.log(err));

// })


router.get('/about', authentication, (req,res)=>{
    console.log('hello my about page');
    res.send(req.rootUser);

});

router.get('/getdata', authentication, (req,res)=>{
    console.log('hello my contact page');
    res.send(req.rootUser);

});


router.post('/contact', authentication, async(req,res)=>{

    try {

        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message){
            console.log("error in contact form");
            return res.status(400).send({status:400, error:"fill the fields properly"})
        }
        
       const userContact = await User.findOne({_id: req.userID})

       if(userContact){

        const userMessage = await userContact.addMessage(name, email, phone, message);
        
        await userContact.save();
        res.status(201).json({message: "message send successfully!!"})
       }

    } catch (error) {
        console.log(error);
    }
})

router.get('/logout', (req,res)=>{
    console.log('hello my logout page');
    res.clearCookie('jwtoken', {path:'/'});
    res.status(200).send('user logout');
});



module.exports = router;