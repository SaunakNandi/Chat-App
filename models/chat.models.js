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
    ],
    avatar:{
        public_id:{
            type:String,
            // required:true,
        },
        url:{
            type:String,
            // required:true,
        }
    },
    bio:{
        type: String,
    }
},{timestamps:true});

export const Chat=model("Chat",chatSchema)
// export const User=mongoose.models.User || model("User",userSchema)