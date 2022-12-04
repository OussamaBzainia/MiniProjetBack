import mongoose from "mongoose"; 
const {Schema,model} =mongoose;

const PostSchema = new Schema ({
    title:{type:String},
    description:{type:String},
    userId: {type:String,ref:"Artist"},
    image: {type:String},
    likes:{type:Array,default:[]}
    // date: Date

})

export default model("Post",PostSchema);