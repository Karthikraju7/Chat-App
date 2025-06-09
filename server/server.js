import express from "express";
import "dotenv/config";
import cors from "cors";
import http from  "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io" ;

const app = express()
const server = http.createServer(app)

//Socket io initialisation
export const io = new Server(server,{
    cors : {origin: "*"}
})

export const userSocketApp = {}; // {userId : socketId}

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;  
    console.log("User connected", userId);
    if (userId){
        userSocketApp[userId] = socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketApp));
    socket.on("disconnect" , ()=>{
        console.log("User disconnected", userId);
        delete userSocketApp[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketApp))
    })
})

app.use(express.json({limit: "1mb"}));  // he used 4mb for photos 
app.use(cors());

//Routes
app.use("/api/status" , (req,res) => res.send("Server running"));
app.use("/api/auth", userRouter);
app.use("/api/messages",  messageRouter)

await connectDB() //function in db.js

const PORT = process.env.PORT || 5000;
server.listen(PORT ,()=> console.log("Server is running live on : " + PORT));
