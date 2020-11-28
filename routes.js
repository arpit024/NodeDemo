const express = require('express')
const router = express();
const Users = require('./models/Users');

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
router.post('/addUser',verifyEmail, async (req, res) => {
    try {
        let data = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: req.body.email,
            Age: req.body.age
        }
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
router.get("/userList",async(req, res)=>{
    let result = await Users.findAll();
    if(result){
        return res.status(200).json({
            result
        })
    }
    return res.status(200).json([])
})
router.delete("/deleteUser",async(req, res)=>{
    let result = await Users.destroy({
        where:{ID:req.body.id}
    })
    if (result) {
        res.status(200).json({
            status: 1,
        })
    } else {
        res.status(400).json({
            status: 0,
        })
    }
})
router.get("/getUser/:id",async(req, res)=>{
    let result = await Users.findOne({
        where:{ID:req.params.id}
    })
    if(result){
        return res.status(200).json({
            status:1,
            data:result
        })
    }else{
        return res.status(400).json({
            status:0
        })
    }
})
router.put("/updateUser", async(req, res)=>{
    let result = await Users.update({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Age: req.body.age
    },{
        where:{ID:req.body.id}
    })
    if (result) {
        res.status(200).json({
            status: 1,
            statusDescription: "Record upated successfully"
        })
    } else {
        res.status(400).json({
            status: 0,
            statusDescription: "Unable to update record"
        })
    }
})
module.exports = router