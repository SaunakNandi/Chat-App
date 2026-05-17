import mongoose, {Schema,model,Types} from 'mongoose'

const requestSchema = new Schema({
    status:{
        type: String,
        default:"pending",
        enum:["pending","accepted","rejected"],
    },
    sender:{
        type: Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiver:{
        type: Types.ObjectId,
        ref:"User",
        required:true,
    },
    type:{
        type:String,
        enum:["FRIEND_REQUEST","GROUP_ALERT"],
        required:true
        
    },
    message:{
        type:String
    }
},{timestamps:true});

export const Request=model("Request",requestSchema)