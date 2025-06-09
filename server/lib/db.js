import mongoose from "mongoose";

// To connect with MongoDB database
export const connectDB = async () =>{
    try{
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        mongoose.connection.on("error", (err) =>console.log("MongoDB Error:", err));
        mongoose.connection.on("disconnected", () =>console.log("Databse Disconnected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error){
        console.log(error);
    }
}