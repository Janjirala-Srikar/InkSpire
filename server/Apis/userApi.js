const exp=require('express')
const userApp=exp.Router();
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const Article=require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require("@clerk/express")

//API

userApp.use(clerkMiddleware())

// Get all articles by author
userApp.get('/articles',requireAuth({signInUrl:"unauthorized"}) ,expressAsyncHandler(async(req,res)=>{
    console.log("hii");
    const ArticleList=await Article.find({isArticleActive:true});
    res.status(200).send({ message: "articles", payload: ArticleList })
}))

userApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})

//create new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    console.log(commentObj,req.params.articleId)
    //add commnetObj to comments array of article
   const articleWithComments= await Article.findOneAndUpdate(
        { articleId:req.params.articleId},
        { $push:{ comments:commentObj}},
        {returnOriginal:false})

        console.log(articleWithComments)
    //send res
    res.status(200).send({message:"comment added",payload:articleWithComments})

}))

module.exports=userApp;