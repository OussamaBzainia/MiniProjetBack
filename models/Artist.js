import mongoose, { mongo } from "mongoose"; 
const {Schema,model} =mongoose;




const ArtistSchema=new Schema(
    {

        email:{
            type:String,
           
            
            
        },
        mdp:{
            type:String,
          
        },
        FullName:{
            type:String,
            
        },
        confirmMdp:{
            type:String
        },
        verified:{ type: Boolean},
        otp:{type:String},
        username:{type:String},
        PhoneNumber:{type:String},
        Gender:{type:String},
        BirthDate:{type:String},
        Description:{type:String},
        resetPasswordToken:{ type: String },
        resetPasswordExpire :{ type: String },
        otpReset:{type:String},
        posts:[{type:mongoose.Types.ObjectId,ref:"Post"}],    
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