import mongoose ,{Schema} from "mongoose";
import mongooseAggtegatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
    videoFile:{   
        url: { type: String, required: true },
         public_id: { type: String, required: true },
    },
    thumbnail:{
        url: { type: String, required: true },//clouniary url
        public_id: { type: String, required: true },
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,    //cloudniary
         required:true  
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})



videoSchema.plugin(mongooseAggtegatePaginate )

export const Video = mongoose.model("Video",videoSchema)