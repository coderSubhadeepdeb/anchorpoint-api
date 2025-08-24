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
        videoLink: {
            type: String,
            required: false
        },
        images:[
            {
                src: {
                    type: String,
                    required: true
                },
                title: {
                    type: String,
                    required: false,
                    default: ""
                },
                description: {
                    type: String,
                    required: false,
                    default: ""
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Project = mongoose.model("Project", projectSchema)