import mongoose from "mongoose"; 

const NotificationSchema = new mongoose.Schema(
  {
    
    userId : {
      type : mongoose.Schema.Types.ObjectId, 
      ref: "Artist"
    },
    message: { type: String },
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
    createdAt: {
        type: Date,
        default: Date.now
      }

  },
  {
    timestamps: false
  }
)
export default  mongoose.model("Notification", NotificationSchema)