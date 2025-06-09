import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

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
            lowercase: true,
            trim: true
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

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

export const Admin = mongoose.model("Admin", adminSchema)