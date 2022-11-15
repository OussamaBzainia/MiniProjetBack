import mongoose from "mongoose"; 
const {Schema,model} =mongoose;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    tokenReset: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

export default model("tokenReset", tokenSchema);