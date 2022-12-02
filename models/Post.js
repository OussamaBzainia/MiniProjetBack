import mongoose from "mongoose"; 
const {Schema,model} =mongoose;

const PostSchema = new Schema ({
    title:{type:String},
    description:{type:String},
    image: {type:String},
    userId: {type:mongoose.Types.ObjectId,ref:"Artist   "}
    // date: Date

})

export default model("Post",PostSchema);