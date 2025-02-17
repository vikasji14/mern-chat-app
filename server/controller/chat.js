import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { sendMessageSchemaValidation } from "../validations/index.js";

export const getAllUsers = async (req, res) => {
    const id = req.query.id;
    if (id === 'undefined' || !id) return res.status(400).json({ success: false, message: 'id is required' })
    try {
        const getUsers = await User.find({ _id: { $ne: id } });
        return res.status(200).json({ data: getUsers, success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}



export const getChat = async (req, res) => {
    const { senderId, receiverId } = req.query;
    if (!senderId || !receiverId) return res.status(400).json({ success: false, message: 'senderId and receiverId are required' })
    try {
        const getChat = await Chat.find({
            $or: [
                { $and: [{ sender: senderId }, { receiver: receiverId }] },
                { $and: [{ sender: receiverId }, { receiver: senderId }] }
            ]
        })
        return res.status(200).json({ data: getChat, success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }

}





export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const { error } = sendMessageSchemaValidation.validate({ senderId, receiverId, message });

    if (error) return res.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
        await newMessage.save();
        return res.status(200).json({ success: true, message: 'Message sent successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}