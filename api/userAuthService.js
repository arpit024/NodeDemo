const app = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const encrypt = require('../utils/encrypt')
const publishEvent = require('../publisherFunctions');
const Joi = require('@hapi/joi')
const _ = require('lodash');
let verifyEmail = async(req, res, next)=>{
    let result = await Users.findOne({
        attribute:['Email'],
        where:{Email:req.body.email}
    })
    if(result){
       return res.status(200).json({
            status:2,
            statusDescription: "Email already registered"
        })
    }
    next()
}

let validateReqBody = (req, res, next)=>{
    const { body } = req; 
    const addUser = Joi.object().keys({ 
        age: Joi.number().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email:Joi.string().email().required(),
        password: Joi.string().required()
    }); 
    const result = Joi.validate(body, addUser); 
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid) { 
        const JoiError = {
            status: 'failed',
            error: {
                original: result.error._original,

                // fetch only message and type from each error
                details: _.map(result.error.details, ({message, type}) => ({
                    message: message.replace(/['"]/g, ''),
                    type
                }))
            }
        };
        return res.status(422).json(JoiError);
    }else{
        next()
    }
}

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return res.json({
                status: 0,
                description: "something went wrong"
            });
        }
        if (!user) {
            return res.json({
                status: 0,
                description: "Invalid username or password"
            });
        }
        req.logIn(user, { session: false }, function (err) {
            if (err) { return next(err); }
            let userObj = {
                user: user.FirstName
            }
            const token = jwt.sign({ user: userObj }, 'secret', { expiresIn: '1d' });

            return res.json({
                status: 1,
                token: `Bearer ${token}`
            });
        });
    })(req, res, next)
})
app.post("/forgotPassword", async (req, res) => {
    let hashedEmail = encrypt.computeHash(req.body.username)
    let result = await Users.findOne({
        where: { HashedEmail: hashedEmail }
    });
    if (!result) {
        return res.json({
            status: 0,
            description: "Invalid username or password"
        })
    } else {
        publishEvent.publishEmailEventForForgotPassword({
            email: req.body.username,
            firstName: result.FirstName,
            lastName: result.LastName
        })
        return res.json({
            status: 1,
            description: "success"
        })
    }
})

app.post('/addUser',validateReqBody,verifyEmail, async (req, res) => {
    try {

        let data = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: encrypt.encrypt(req.body.email),
            HashedEmail: encrypt.computeHash(req.body.email),
            Age: req.body.age,
            Password: await encrypt.getHashedPassword(req.body.password)
        }
        console.log(data)
        let result = await Users.create(data);
        if (result) {
            res.status(200).json({
                status: 1,
                statusDescription: "Record saved successfully"
            })
        } else {
            res.status(400).json({
                status: 0,
                statusDescription: "Unable to save record"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json("something went wrong")
    }
})

module.exports = app