const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    studentNumber: {
        type: String
    },
    employeeNumber: {
        type: String
    },
    message: {
        type: String
    },
    send: {
        type: String
    }
}, { collection: 'messages' })

const Message = mongoose.model('messages', messagesSchema)


module.exports = Message;