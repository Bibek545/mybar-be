import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema({
    token: {
        type:String,
        required: true,
    },
    association: {
        type: String,
    },
    expire: {
        type: Date,
        required: true,
        default: new Date(Date.now()+ 86400000),
        expires: 0,
    }
},
{
    timestamps: true,
});

export default mongoose.model("Session", sessionSchema);