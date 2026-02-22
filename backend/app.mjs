import express from "express";
import sequezile from "./config/DB.js";
import models from "./model/association.js";
import userRouter from "./router/user.js";
import dailyUserStatusRouter from  "./router/dailyUserStatus.js";
import cors from "cors";
import { createServer } from 'node:http';
import socketConnection from "./socketIO/connection.js";

const app=express();
const server=createServer(app);
 
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
 
app.use("/api/user",userRouter);
app.use("/api/status",dailyUserStatusRouter);
/* 404 Handler - Always Keep At Bottom */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
    path: req.originalUrl
  });
});
server.listen(5000,async()=>{
    console.log("sever listean on 5000");
    try {
        await sequezile.sync({force:false});
        await sequezile.authenticate();
        socketConnection(server);
        console.log("database is connected");

    } catch (error) {
        console.error("Database connection error ❌", error);
    }
})
