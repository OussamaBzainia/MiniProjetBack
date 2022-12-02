import mongoose from "mongoose"; 
const {Schema,model} =mongoose;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Artist"
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        expires: 3600,
    },
});

export default model("tokenReset", tokenSchema);