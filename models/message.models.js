import mongoose,{Schema,model,Types} from 'mongoose'

const messageSchema = new Schema({
    content:String,
    attachments:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    sender:{
        type: Types.ObjectId,
        ref:"User",
        required:true,
    },
    chat:{
        type: Types.ObjectId,
        ref:"Chat",
        required:true,
    },
},{timestamps:true});

export const Message=model("Message",messageSchema)
// export const User=mongoose.models.User || model("User",userSchema)