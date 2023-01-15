const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    
}, { collection: 'Users' });

module.exports = mongoose.model('User', userSchema)