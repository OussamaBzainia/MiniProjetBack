import mongoose from "mongoose"; 
const {Schema,model} =mongoose;


const ArtistSchema=new Schema(
    {

        email:{
            type:String,
            required:true,
            index: { unique: true }
            
        },
        mdp:{
            type:String,
            required:true
        },
        confirmMdp:{
            type:String
        },
        nom:{
            type:String,
            required:true
        },
        prenom:{
            type:String,
            required:true
        },
        token: { type: String },
        ProfilePic:{
            type: String
        },
    
    },

    {
        timestamps:true
    }
);

export default model("Artist",ArtistSchema);