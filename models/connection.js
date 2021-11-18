// Imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema( {
    title: {type: String, required: [true, 'name is required']},
    category: {type: String, required: [true, 'category is required']},
    details: {type: String, required: [true, 'details is required'], 
    minLength: [10, 'details should be at least 10 characters']},
    date: {type: String, required: [true, 'date is required']},
    start: {type: String, required: [true, 'start time is required']},
    end: {type: String, required: [true, 'end time is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    image: {type: String, required: [true, 'image url is required']},
    location: {type: String, required: [true, 'location is required']}
},
{timestamps: true}
);

// collection name is connections
module.exports = mongoose.model('Connection', connectionSchema);
