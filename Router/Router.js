const express = require("express");
var bcrypt = require('bcryptjs')
const cors = require("cors")
var jwt = require('jsonwebtoken');
const Router = express.Router();
const { UserModel } = require("../model/user");
const{BlogModel}=require("../model/blogs")


Router.use(cors({
    origin: "*"
}))

Router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const userpresent = await UserModel.findOne({ email })

    if (userpresent) {
        res.send({ msg: "you are already register, please login with correct data" });
        return;
    }

    bcrypt.hash(password, 3, async function (err, hash) {
        const new_user = UserModel({
            name,
            email,
            password: hash
        })
        await new_user.save();
    });
    const data = await UserModel.find();
    res.send({ data });

})


Router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const data = await UserModel.findOne({ email })
    if (data) {
        const UserPassword = data.password
        bcrypt.compare(password, UserPassword, function (err, result) {
            if (result) {
                var token = jwt.sign({ UserId: data._id }, process.env.TOKENKEY);
                res.send({ msg: "login successfull", token })
            } else {
                res.send({ msg: "please provide the correct details" })
            }
        });

    } else {
        res.send({ msg: "login first" })
    }
})



const check = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.TOKENKEY, function (err, decoded) {
        if (err) {
            res.send({ msg: "Login first" })
            return;
        }
        const { UserId } = decoded;
        req.UserId = UserId;
        next();
    });
}

// Router.use(check)

Router.get("/blogs",check,async(req,res)=>{
   const data=await BlogModel.find();
    res.send({data});
})

Router.post("/blogs/add",check,async(req,res)=>{
    const{title,category,author,content}=req.body;
    const checkData=await BlogModel.findOne({title,category,author,content})
    if (checkData) {
        res.send({ msg: "items is already add in todos" });
        return;
    }
    console.log(req.UserId)
    const userID=req.UserId
   const blogs_data=BlogModel({
       title,
       category,
       author,
       content,
       user_id:userID

    })
    try {
        await blogs_data.save();
        res.send({ msg: "task add successfully" })
    } catch (err) {
        res.send({ msg: "error add" });
    }
})


Router.put("/blogs/put/:ID",check, async (req, res) => {
    const { title, author, category ,content} = req.body
    const { ID } = req.params;
    const doc = await BlogModel.findOne({ _id: ID, user_id: req.UserId });
    if (doc) {
        doc.title = title;
        doc.author = author;
        doc.category = category;
        doc.content=content;

        await doc.save();
        res.send(doc)
    } else {
        res.send({ msg: "you are not able to put this id tasks" })
    }



})


Router.delete("/blogs/delete/:ID",check, async (req, res) => {
    const { ID } = req.params;
    try {
        const data = await BlogModel.findOneAndDelete({ _id: ID, user_id: req.UserId });
        if (data) {
            res.send({ data })
        } else {
            res.send({ msg: "you are not able to delete this id tasks" })
        }
    } catch (err) {
        res.send("wrong on delete part")
    }
})



module.exports = { Router }