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
},{timestamps:true});

export const Request=model("Request",requestSchema)
// export const User=mongoose.models.User || model("User",userSchema)