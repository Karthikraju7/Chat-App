import Message from "../models/message.js";
import User from "../models/user.js";
import { io, userSocketApp } from "../server.js";

export const getUsers = async(req , res) => {
    try {
        const userId = req.user._id;
        const otherUsers = await User.find({_id: {$ne: userId}}).select("-password");
        res.json({success:true , users: otherUsers})
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id : selectedUserid} = req.params;
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                {senderId : myId , receiverId: selectedUserid},
                {senderId : selectedUserid , receiverId: myId}
            ]
        })
//         Model.updateMany(filter, updateData)
//         filter: which documents to find
//         updateData: what fields to update
        await Message.updateMany({senderId: selectedUserid, receiverId: myId},
            {seen: true});
        res.json({success:true , messages})

    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}

export const markMessageAsSeen = async(req,res) =>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}

export const sendMessage =  async(req,res) => {
    try {
        const {text} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text
        })

        //after initialising socket in server.js
        const receiverSocketId = userSocketApp[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
 
        res.json({success:true , newMessage});


    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message})
    }
}