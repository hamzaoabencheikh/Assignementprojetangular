const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    ownerPicture:{
        type: String
    },
    assignmentPictures: {
        type: String
    }
    
}, { collection: 'Courses' });

module.exports = mongoose.model('Course', courseSchema)