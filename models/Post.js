import mongoose from "mongoose"; 
const {Schema,model} =mongoose;

const PostSchema = new Schema ({
    description:{type:String},
    userId: {type:String,ref:"Artist"},
    image: {type:String},
    likes:{type:Array,default:[]},
    date: {String},
    isLiked:{type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now }

})

export default model("Post",PostSchema);