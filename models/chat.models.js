import {Schema,model,Types} from 'mongoose'

const chatSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    groupChat:{
        type:Boolean,
        default: false,
    },
    creator:{
        type: Types.ObjectId,
        ref:"User",
    },
    members:[
        {
            type: Types.ObjectId,
            ref:"User",
        }
    ]
},{timestamps:true});

export const Chat=model("Chat",chatSchema)
// export const User=mongoose.models.User || model("User",userSchema)