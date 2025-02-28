const exp=require('express')
const adminApp=exp.Router()

adminApp.get('/',(req,res)=>{
    res.send({message:"res from admin"})
})

module.exports=adminApp;