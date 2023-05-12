import mongoose from "mongoose"; 


const ConversationSchema = new mongoose.Schema(
  {
    lastMessage : {type: String}, 
    lastMessageDate : {type: Date}, 
    sender : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist"
    },
    receiver : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist"
    },
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
)
export default mongoose.model("Conversation", ConversationSchema)