import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";




export async  function getAllConversations   (req, res) {
    res.send({conversations: await Conversation.find()})
}

export async function getAllMessages  (req, res) {
    res.send({messages: await Message.find()})
}

export async function getMyConversations  (req, res) {
    res.send({conversations: await Conversation.find({"sender": req.params.senderId}).populate("sender receiver")})
}

export async function getMyMessages   (req, res)  {
    res.send({
        messages: await Message.find(
            {
                $or: [
                    {'senderConversation': req.params.conversationId},
                    {'receiverConversation': req.params.conversationId},
                ]
            }
        ).populate("senderConversation receiverConversation")
    })
}

export async function createConversation (req, res)  {
    const {sender, receiver} = req.body

    let senderConversation = await Conversation.findOne({"sender": sender, "receiver": receiver})
    if (!senderConversation) {
        senderConversation = new Conversation()
        senderConversation.sender = sender
        senderConversation.receiver = receiver
    }
    senderConversation.lastMessage = "New conversation"
    senderConversation.lastMessageDate = Date()
    senderConversation.save()

    res.status(200).send({message: "success"})
}

export async function sendMessage  (req, res)  {
    const {description, senderId, receiverId} = req.body

    let senderConversation = await Conversation.findOne({"sender": senderId, "receiver": receiverId})
    if (!senderConversation) {
        senderConversation = new Conversation()
        senderConversation.sender = senderId
        senderConversation.receiver = receiverId
    }
    senderConversation.lastMessage = description
    senderConversation.lastMessageDate = Date()
    senderConversation.save()

    let receiverConversation = await Conversation.findOne({"sender": receiverId, "receiver": senderId})
    if (!receiverConversation) {
        receiverConversation = new Conversation()
        receiverConversation.sender = receiverId
        receiverConversation.receiver = senderId
    }
    receiverConversation.lastMessage = description
    receiverConversation.lastMessageDate = Date()
    receiverConversation.save()

    const newMessage = new Message()
    newMessage.description = description
    newMessage.senderConversation = senderConversation._id
    newMessage.receiverConversation = receiverConversation._id
    await newMessage.save()

    res.status(200).send({message: "success", newMessage: newMessage})
}

export async function deleteMessage (req, res) {
    await Message.findById(req.body._id).remove();
    res.status(200).send({message: "success"})
}

export async function deleteConversation (req, res)  {
    const conversation = await Conversation.findById(req.body._id).remove()
    res.status(200).send({message: "success", conversation})
}

export async function deleteAll (req, res) {
    Conversation.remove({}, function (err) {
        if (err) {
            return handleError(res, err)
        }
    })
    Message.remove({}, function (err) {
        if (err) {
            return handleError(res, err)
        }
    })

    res.status(204).send({message: "done"})
}