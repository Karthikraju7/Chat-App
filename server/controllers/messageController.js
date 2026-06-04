import Message from "../models/message.js";
import User from "../models/user.js";
import { io, userSocketApp } from "../server.js";

export const getUsers = async(req , res) => {
    try {
        const userId = req.user._id;
        const otherUsers = await User.find({_id: {$ne: userId}}).select("-password");
        const unseenMessages = await Message.aggregate([
            { $match: { receiverId: userId, seen: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);
        const unseenCount = {};
        unseenMessages.forEach(({ _id, count }) => {
            unseenCount[_id.toString()] = count;
        });
        res.json({success:true , users: otherUsers, unseenMessages: unseenCount})
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

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const message = await Message.findById(id);
        if (!message) return res.json({ success: false, message: "Message not found" });
        if (message.senderId.toString() !== userId.toString())
            return res.json({ success: false, message: "Unauthorized" });
        await Message.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}