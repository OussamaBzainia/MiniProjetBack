import express from 'express';
import {getAllConversations,getAllMessages,getMyConversations,getMyMessages,createConversation,sendMessage,deleteConversation,deleteMessage,deleteAll} from '../controllers/ChatController.js';

const router=express.Router();


router.route("/getAllConversations").get(getAllConversations)
router.route("/getAllMessages").get(getAllMessages)
router.route("/getMyConversations/:senderId").get(getMyConversations)
router.route("/getMyMessages/:conversationId").get(getMyMessages)
router.route("/createConversation").post(createConversation)
router.route("/sendMessage").post(sendMessage)
router.route("/deleteConversation").delete(deleteConversation)
router.route("/deleteMessage").delete(deleteMessage)
router.route("/deleteAll").delete(deleteAll)

export default router