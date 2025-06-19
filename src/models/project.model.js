import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        category:{
            type: String,
            required: true
        },
        images:[
            {
                type: String,
                required: false
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Project = mongoose.model("Project", projectSchema)