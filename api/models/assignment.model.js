const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    subject: {
        required: true,
        type: String
    },
    mark: {
        type: String
    },
    remark: {
        type: String
    },
    date:{
        type: String
    },
    completed: {
        type: Boolean
    }
    
}, { collection: 'Assignments' });

module.exports = mongoose.model('Assignment', assignmentSchema)