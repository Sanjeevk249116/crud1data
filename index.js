const express=require("express");

require("dotenv").config();


const{connection}=require("./config/connection")
const{Router}=require("./Router/Router")
const app=express();


app.use(express.json());
app.use("/",Router)



app.listen(process.env.PORT,async()=>{
     try{
        await connection
        console.log("connect")
     }catch(err){
        console.log("not connect")
     }
    console.log("api link with 8080");
})