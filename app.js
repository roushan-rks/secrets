require('dotenv').config()
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const app = express();
 const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
 app.set('view engine', 'ejs');

 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});
// const secret = "ThisisourLittlesecret.";
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
// userSchema.plugin(encrypt, { secret: secret });
const User = new mongoose.model("User",userSchema);
 app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/register",function(req,res){
    const newuser = new User({
        email:req.body.username,
        password:req.body.password

    });
    newuser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("successfully added new user");
        }
    });
    res.render("secrets");
});
app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result.password===req.body.password){
                res.render("secrets");
            }
            else{
                console.log("Please register then login");
            }
        }
    });
});















app.listen(3000,function(){
    console.log("server started on port 3000");
});
