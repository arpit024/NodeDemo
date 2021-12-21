const express = require('express')
const router = express();
const Users = require('../models/Users');
const encrypt = require('../utils/encrypt')

router.get("/userList",async(req, res)=>{
    let resData = await Users.findAll();
    let result=[]
    resData.forEach((item)=>{
        let data={
            ID : item.ID,
            Email : encrypt.decrypt(item.Email),
            FirstName : item.FirstName,
            LastName : item.LastName,
            Age : item.Age
        }
        result.push(data)
    })
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