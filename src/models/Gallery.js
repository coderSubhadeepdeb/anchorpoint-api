import mongoose from 'mongoose';
const gallerySchema = new mongoose.Schema({

    imageUrls: [{
        type: String,
        required: true,
        trim: true,
        minlength: 1,   
    }],
    cloudinaryId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,   
    }
});
const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;