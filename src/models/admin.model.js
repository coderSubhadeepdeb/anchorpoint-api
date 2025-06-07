import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowecase: true
        },
        password:{
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Admin = mongoose.model("Admin", adminSchema)